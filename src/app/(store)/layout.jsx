"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function StoreLayout({ children }) {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
