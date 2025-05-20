import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PopAdsScript from "@/components/ads/PopAdsScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JFlix - Kiss it Real! Your Ultimate Streaming Platform",
  description: "Stream Movies, TV Shows, Korean TV, Anime, and Pinoy Adult content on JFlix. Kiss it Real!",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover'
  },
  themeColor: '#141414',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JFlix'
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-16 md:pt-20">{children}</main>
          <Footer />
        </div>
        <PopAdsScript />
      </body>
    </html>
  );
}
