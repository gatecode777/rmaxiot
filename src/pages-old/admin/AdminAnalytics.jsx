import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/admin/AdminDashboard.css';

const AdminAnalytics = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard" style={{ padding: "30px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "600", color: "#333" }}>Analytics & Insights</h2>
        </div>

        {/* Highlight Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.03)", borderLeft: "4px solid #4e73df" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#858796", fontSize: "12px", textTransform: "uppercase", fontWeight: "700" }}>Monthly Growth</h4>
            <span style={{ fontSize: "22px", fontWeight: "700", color: "#5a5c69" }}>+12.4%</span>
          </div>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.03)", borderLeft: "4px solid #1cc88a" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#858796", fontSize: "12px", textTransform: "uppercase", fontWeight: "700" }}>Conversion Rate</h4>
            <span style={{ fontSize: "22px", fontWeight: "700", color: "#5a5c69" }}>3.42%</span>
          </div>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.03)", borderLeft: "4px solid #36b9cc" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#858796", fontSize: "12px", textTransform: "uppercase", fontWeight: "700" }}>Average Order Value</h4>
            <span style={{ fontSize: "22px", fontWeight: "700", color: "#5a5c69" }}>₹4,250.00</span>
          </div>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.03)", borderLeft: "4px solid #f6c23e" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#858796", fontSize: "12px", textTransform: "uppercase", fontWeight: "700" }}>Active Sessions</h4>
            <span style={{ fontSize: "22px", fontWeight: "700", color: "#5a5c69" }}>184 Live</span>
          </div>
        </div>

        {/* Charts & Graphs Row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px", marginBottom: "30px" }}>
          
          {/* Main Sales Trend Mock Graph */}
          <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "600", color: "#4e73df" }}>Sales Performance (Weekly)</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "200px", padding: "10px 0", borderBottom: "2px solid #eaecf4" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "12%" }}>
                <div style={{ width: "100%", background: "#4e73df", height: "45px", borderRadius: "4px 4px 0 0" }}></div>
                <span style={{ marginTop: "10px", fontSize: "11px", color: "#858796" }}>Mon</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "12%" }}>
                <div style={{ width: "100%", background: "#4e73df", height: "90px", borderRadius: "4px 4px 0 0" }}></div>
                <span style={{ marginTop: "10px", fontSize: "11px", color: "#858796" }}>Tue</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "12%" }}>
                <div style={{ width: "100%", background: "#4e73df", height: "135px", borderRadius: "4px 4px 0 0" }}></div>
                <span style={{ marginTop: "10px", fontSize: "11px", color: "#858796" }}>Wed</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "12%" }}>
                <div style={{ width: "100%", background: "#4e73df", height: "110px", borderRadius: "4px 4px 0 0" }}></div>
                <span style={{ marginTop: "10px", fontSize: "11px", color: "#858796" }}>Thu</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "12%" }}>
                <div style={{ width: "100%", background: "#4e73df", height: "160px", borderRadius: "4px 4px 0 0" }}></div>
                <span style={{ marginTop: "10px", fontSize: "11px", color: "#858796" }}>Fri</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "12%" }}>
                <div style={{ width: "100%", background: "#f5a623", height: "185px", borderRadius: "4px 4px 0 0" }}></div>
                <span style={{ marginTop: "10px", fontSize: "11px", color: "#858796" }}>Sat</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "12%" }}>
                <div style={{ width: "100%", background: "#f5a623", height: "145px", borderRadius: "4px 4px 0 0" }}></div>
                <span style={{ marginTop: "10px", fontSize: "11px", color: "#858796" }}>Sun</span>
              </div>
            </div>
          </div>

          {/* Traffic Sources Mock Pie-chart style */}
          <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "600", color: "#4e73df" }}>Traffic Channels</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5a5c69", marginBottom: "5px" }}>
                  <span>Direct Search</span>
                  <strong>55%</strong>
                </div>
                <div style={{ height: "8px", background: "#eaecf4", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "55%", background: "#4e73df", height: "100%" }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5a5c69", marginBottom: "5px" }}>
                  <span>Social Referrals</span>
                  <strong>30%</strong>
                </div>
                <div style={{ height: "8px", background: "#eaecf4", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "30%", background: "#1cc88a", height: "100%" }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5a5c69", marginBottom: "5px" }}>
                  <span>Email Marketing</span>
                  <strong>15%</strong>
                </div>
                <div style={{ height: "8px", background: "#eaecf4", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "15%", background: "#36b9cc", height: "100%" }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
