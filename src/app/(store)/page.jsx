import connectDB from '@/server/config/db';
import Product from '@/server/models/Product';
import Home from '@/pages-old/Home';

export default async function Page() {
  try {
    // 1. Establish DB Connection
    await connectDB();

    // 2. Fetch best sellers (limit 8, sort by latest active)
    const bestSellersDocs = await Product.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    // 3. Fetch new arrivals (isNewArrival: true, status: 'active', limit: 8)
    const newArrivalsDocs = await Product.find({ isNewArrival: true, status: 'active' })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    // 4. Fetch featured products (isFeatured: true, status: 'active', limit: 4)
    const featuredDocs = await Product.find({ isFeatured: true, status: 'active' })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    // 5. Serialize safely for client component props
    const initialBestSellers = JSON.parse(JSON.stringify(bestSellersDocs));
    const initialNewArrivals = JSON.parse(JSON.stringify(newArrivalsDocs));
    const initialFeatured = JSON.parse(JSON.stringify(featuredDocs));

    return (
      <Home 
        initialBestSellers={initialBestSellers}
        initialNewArrivals={initialNewArrivals}
        initialFeatured={initialFeatured}
      />
    );
  } catch (error) {
    console.error("SSR home products fetch error:", error);
    // Fallback to client-side fetching in case of any database/server issues
    return <Home />;
  }
}
