import localFont from "next/font/local";
import "./globals.css";
import database from "@/appwrite/database";
import { CartProvider } from './components/CartProvider';
import { Toaster } from 'sonner';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: {
    default: 'Knotted With Love | Handcrafted Crochet & Knitted Treasures',
    template: '%s | Knotted With Love'
  },
  description: 'Discover unique, handmade crochet and knitted items at Knotted With Love. From cozy sweaters to stylish bags, each piece is crafted with care using eco-friendly materials. Shop our collection for one-of-a-kind, artisanal creations that blend comfort with contemporary design.',
  keywords: ['crochet', 'handmade', 'knitted', 'bags', 'sweaters', 'eco-friendly', 'artisanal', 'custom orders', 'sustainable fashion', 'handcrafted accessories'],
  authors: [{ name: 'Knotted With Love Team' }],
  creator: 'Knotted With Love',
  publisher: 'Knotted With Love',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.knottedwithlove.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Knotted With Love | Handcrafted Crochet & Knitted Treasures',
    description: 'Explore our collection of unique, handmade crochet and knitted items. From cozy sweaters to stylish bags, each piece is crafted with love using eco-friendly materials.',
    url: 'https://www.knottedwithlove.com',
    siteName: 'Knotted With Love',
    images: [
      {
        url: '/opengraph-image.png', 
        width: 1200,
        height: 630,
        alt: 'Knotted With Love - Handcrafted Crochet & Knitted Items',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knotted With Love | Handcrafted Crochet & Knitted Treasures',
    description: 'Discover unique, handmade crochet and knitted items. From cozy sweaters to stylish bags, each piece is crafted with care using eco-friendly materials.',
    images: ['/opengraph-image.png'],
  },
  verification: {
    google: 'your-google-site-verification-code', // Replace with your actual code when you have it
  },
  category: 'E-commerce',
  manifest: "site.webmanifest",
  icons: {
    icon: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    'custom-made': 'true',
    'eco-friendly': 'true',
    'handcrafted': 'true',
    'material': 'yarn, cotton, wool',
    'product-types': 'sweaters, bags, accessories',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4A90E2",
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {children}
          <Toaster richColors position="top-center" />
        </CartProvider>
      </body>
    </html>
  );
}
