"use client";

import { use } from 'react';
import ProductForm from '@/pages-old/admin/ProductForm';

export default function Page({ params }) {
  const { id } = use(params);
  return <ProductForm idOverride={id} />;
}
