"use client";

import { use } from 'react';
import ProductDetail from '@/pages-old/ProductDetail';

export default function Page({ params }) {
  const { slug } = use(params);
  return <ProductDetail slugOverride={slug} />;
}
