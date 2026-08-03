"use client";

import { use } from 'react';
import OrderDetailPage from '@/pages-old/OrderDetail';

export default function Page({ params }) {
  const { orderId } = use(params);
  return <OrderDetailPage orderIdOverride={orderId} />;
}
