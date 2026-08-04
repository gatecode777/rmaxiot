import connectDB from '@/server/config/db';
import Product from '@/server/models/Product';
import Category from '@/server/models/Category';
import OurProducts from '@/pages-old/OurProducts';

export default async function Page() {
  try {
    // 1. Establish DB Connection
    await connectDB();

    // 2. Fetch active parent categories
    const categoriesDocs = await Category.find({ isActive: true, parentCategory: null })
      .sort({ order: 1 })
      .lean();

    // Calculate productCount dynamically on the server for each category
    const categoriesWithCount = await Promise.all(
      categoriesDocs.map(async (cat) => {
        const count = await Product.countDocuments({
          category: cat._id,
          status: 'active'
        });
        return {
          ...cat,
          productCount: count
        };
      })
    );

    // 3. Fetch initial products (limit 12, sort by latest)
    const productsDocs = await Product.find({ status: 'active' })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    // 4. Serialize safely
    const initialCategories = JSON.parse(JSON.stringify(categoriesWithCount));
    const initialProducts = JSON.parse(JSON.stringify(productsDocs));

    return (
      <OurProducts 
        initialProducts={initialProducts} 
        initialCategories={initialCategories} 
      />
    );
  } catch (error) {
    console.error("SSR product fetch error:", error);
    // Fallback to client-side fetching in case of any server connection issues
    return <OurProducts />;
  }
}
