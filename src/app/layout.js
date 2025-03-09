import localFont from "next/font/local";
import { Inter, Playfair_Display, DM_Sans, Plus_Jakarta_Sans, Leckerli_One, Allura } from 'next/font/google';
import "./globals.css";
import { CartProvider } from './components/CartProvider';
import { Toaster } from 'sonner';
import { GoogleAnalytics } from '@next/third-parties/google';
import Footer from './components/Footer';

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


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const leckerli = Leckerli_One({ subsets: ['latin'], variable: '--font-leckerli', weight: '400' });
const allura = Allura({ subsets: ['latin'], variable: '--font-allura', weight: '400' });


const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading'
});

export const metadata = {
  title: {
    default: 'KnitKart | Modern Crochet & Knitted Essentials',
    template: '%s | KnitKart'
  },
  description: 'Discover modern, handcrafted crochet and knitted items at KnitKart. From cozy sweaters to contemporary accessories, each piece is crafted with precision using premium materials. Shop our curated collection of artisanal creations that blend tradition with modern design.',
  keywords: ['crochet', 'handmade', 'knitted', 'accessories', 'sweaters', 'premium', 'artisanal', 'custom orders', 'modern fashion', 'handcrafted essentials'],
  authors: [{ name: 'KnitKart Team' }],
  creator: 'KnitKart',
  publisher: 'KnitKart',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://knitkart.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'KnitKart | Modern Crochet & Knitted Essentials',
    description: 'Explore our collection of modern, handcrafted crochet and knitted items. From cozy sweaters to contemporary accessories, each piece is crafted with precision using premium materials.',
    url: 'https://knitkart.in',
    siteName: 'KnitKart',
    images: [
      {
        url: '/opengraph-image.png', 
        width: 1200,
        height: 630,
        alt: 'KnitKart - Modern Crochet & Knitted Essentials',
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
    title: 'KnitKart | Modern Crochet & Knitted Essentials',
    description: 'Discover modern, handcrafted crochet and knitted items. From cozy sweaters to contemporary accessories, each piece is crafted with precision.',
    images: ['/opengraph-image.png'],
  },
  verification: {
    google: 'snj5gapw5rZUnRp7exOcGk-dSyY6kaorMwWYOvSA9nM',
  },
  category: 'E-commerce',
  manifest: "/manifest.json",
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon-16x16.png',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#E11D48'
      }
    ]
  },
  other: {
    'custom-made': 'true',
    'premium-quality': 'true',
    'handcrafted': 'true',
    'material': 'yarn, cotton, wool',
    'product-types': 'sweaters, accessories, home decor',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E11D48", // Rose-600 from Tailwind
  viewportFit: "cover",
  colorScheme: "light",
  minimumScale: 1,
  maximumScale: 5
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <head>
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-2048-2732.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1668-2388.jpg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1536-2048.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1125-2436.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1242-2688.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-828-1792.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-750-1334.jpg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-640-1136.jpg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} ${dmSans.variable} ${plusJakarta.variable} ${leckerli.variable} ${allura.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <Footer />
          <Toaster richColors position="top-center" />
          <GoogleAnalytics gaId="G-1ZNXBSLP6E" />
        </CartProvider>
      </body>
    </html>
  );
}
