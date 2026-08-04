"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StoreLayout({ children }) {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main>{children}</main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        limit={3}
      />
    </div>
  );
}
