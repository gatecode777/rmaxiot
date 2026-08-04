import connectDB from '@/server/config/db';
import Product from '@/server/models/Product';
import ProductDetail from '@/pages-old/ProductDetail';

export default async function Page({ params }) {
  const { slug } = await params;

  try {
    // 1. Establish DB Connection
    await connectDB();

    // 2. Fetch the product by slug
    const productDoc = await Product.findOne({
      slug: slug,
      status: 'active',
    })
      .populate('category', 'name slug')
      .select('-createdBy -updatedBy')
      .lean();

    if (productDoc) {
      // Increment view count non-blocking
      Product.findByIdAndUpdate(productDoc._id, { $inc: { views: 1 } }).catch(() => {});
    }

    // 3. Serialize safely
    const initialProduct = productDoc ? JSON.parse(JSON.stringify(productDoc)) : null;

    return <ProductDetail slugOverride={slug} initialProduct={initialProduct} />;
  } catch (error) {
    console.error("SSR product detail fetch error:", error);
    // Fallback to client-side fetching
    return <ProductDetail slugOverride={slug} />;
  }
}
