const mongoose = require("mongoose");
const https = require("https");

// ─── DNS-over-HTTPS Resolution ──────────────────────────────────────────────
// Standard UDP/TCP DNS SRV queries may be blocked by firewalls.
// We use Google's DNS-over-HTTPS (port 443) which is never blocked.

function dohQuery(name, type) {
  return new Promise((resolve, reject) => {
    const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`;
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function resolveMongoSRV(uri) {
  // Only do SRV resolution if the URI uses the +srv scheme
  if (!uri.startsWith("mongodb+srv://")) return uri;

  try {
    // Parse the original URI to extract credentials and database
    // Format: mongodb+srv://user:pass@host/db?options
    const withoutScheme = uri.replace("mongodb+srv://", "");
    const atIdx = withoutScheme.lastIndexOf("@");
    const credentials = withoutScheme.substring(0, atIdx);
    const rest = withoutScheme.substring(atIdx + 1);
    const slashIdx = rest.indexOf("/");
    const srvHost = slashIdx !== -1 ? rest.substring(0, slashIdx) : rest;
    const dbAndOptions = slashIdx !== -1 ? rest.substring(slashIdx) : "";

    console.log(`🔍 Resolving SRV for ${srvHost} via DNS-over-HTTPS...`);

    // Resolve SRV records
    const srvResult = await dohQuery(`_mongodb._tcp.${srvHost}`, "SRV");
    if (!srvResult.Answer || srvResult.Answer.length === 0) {
      throw new Error("No SRV records found");
    }

    // Resolve TXT records for replica set and auth options
    const txtResult = await dohQuery(srvHost, "TXT");
    let txtOptions = "authSource=admin&replicaSet=atlas-placeholder&tls=true";
    if (txtResult.Answer && txtResult.Answer.length > 0) {
      // TXT data from DoH has outer quotes stripped — join multi-chunk records
      const rawTxt = txtResult.Answer
        .map((a) => a.data.replace(/^"|"$/g, "").replace(/"\s*"/g, ""))
        .join("&");
      // Ensure tls=true is always present
      txtOptions = rawTxt.includes("tls=") ? rawTxt : rawTxt + "&tls=true";
    }

    // Build hosts list from SRV answers
    // SRV data format: "priority weight port target"
    const hosts = srvResult.Answer.map((record) => {
      const parts = record.data.trim().split(" ");
      const port = parts[2];
      const target = parts[3].replace(/\.$/, ""); // remove trailing dot
      return `${target}:${port}`;
    });

    // Construct direct connection string
    const directUri = `mongodb://${credentials}@${hosts.join(",")}${dbAndOptions}${dbAndOptions.includes("?") ? "&" : "?"}${txtOptions}`;

    // Log URI with password masked for debugging
    const debugUri = directUri.replace(/:([^@]+)@/, ":****@");
    console.log(`🔗 Direct URI: ${debugUri}`);
    console.log(`✅ Resolved to direct connection with ${hosts.length} host(s)`);
    return directUri;

  } catch (err) {
    console.warn(`⚠️  DNS-over-HTTPS resolution failed: ${err.message}. Falling back to original URI.`);
    return uri;
  }
}

// ─── Singleton connection ─────────────────────────────────────────────────────
let connectionPromise = null;
let resolvedUri = null;

const connectDB = async () => {
  // Already connected — return immediately
  if (mongoose.connection.readyState === 1) return;

  // Connection in progress — wait for it
  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  connectionPromise = (async () => {
    const maxRetries = 3;

    // Resolve the SRV URI once and cache it
    if (!resolvedUri) {
      resolvedUri = await resolveMongoSRV(process.env.MONGODB_URI);
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await mongoose.connect(resolvedUri, {
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
          socketTimeoutMS: 30000,
          family: 4,
        });
        console.log("✅ MongoDB Connected");
        return;
      } catch (error) {
        console.error(
          `❌ MongoDB Connection attempt ${attempt}/${maxRetries} failed: ${error.message}`
        );
        if (attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, 2000));
        } else {
          throw error;
        }
      }
    }
  })();

  try {
    await connectionPromise;
  } finally {
    connectionPromise = null;
  }
};

module.exports = connectDB;
