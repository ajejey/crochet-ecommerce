import localFont from "next/font/local";
import { Inter, Playfair_Display, DM_Sans, Plus_Jakarta_Sans, Leckerli_One, Allura } from 'next/font/google';
import "./globals.css";
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body
        className={`${inter.variable} ${playfair.variable} ${dmSans.variable} ${geistSans.variable} ${geistMono.variable} ${leckerli.variable} ${allura.variable} antialiased`}
      >
        <CartProvider>
          {children}
          <Toaster richColors position="top-center" />
        </CartProvider>
      </body>
    </html>
  );
}
