import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'RMAX Solutions',
  description: 'RMAX Solutions E-Commerce platform for advanced devices and products.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Swiper CSS */}
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css" 
        />
        {/* Swiper script */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
