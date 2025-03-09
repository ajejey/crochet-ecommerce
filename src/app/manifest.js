export default function manifest() {
  return {
    name: "KnitKart | Modern Crochet & Knitted Essentials",
    short_name: "KnitKart",
    description: "Discover modern, handcrafted crochet and knitted items at KnitKart. From cozy sweaters to contemporary accessories, each piece is crafted with precision using premium materials.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF1F2",
    theme_color: "#E11D48",
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    orientation: "portrait",
    lang: "en-IN",
    categories: ["shopping", "lifestyle", "fashion"],
    screenshots: [
      {
        src: "/screenshots/home-mobile.jpg",
        sizes: "750x1334",
        type: "image/jpeg",
        platform: "narrow",
        label: "KnitKart Home Screen"
      },
      {
        src: "/screenshots/product-mobile.jpg",
        sizes: "750x1334",
        type: "image/jpeg",
        platform: "narrow",
        label: "Product Details"
      },
      {
        src: "/screenshots/home-desktop.jpg",
        sizes: "1280x800",
        type: "image/jpeg",
        platform: "wide",
        label: "KnitKart Home Screen"
      },
      {
        src: "/screenshots/product-desktop.jpg",
        sizes: "1280x800",
        type: "image/jpeg",
        platform: "wide",
        label: "Product Details"
      }
    ],
    shortcuts: [
      {
        name: "Shop Now",
        short_name: "Shop",
        description: "Browse our collection",
        url: "/shop",
        icons: [{ src: "/icons/shop-icon-96x96.png", sizes: "96x96" }]
      },
      {
        name: "My Cart",
        short_name: "Cart",
        description: "View your shopping cart",
        url: "/cart",
        icons: [{ src: "/icons/cart-icon-96x96.png", sizes: "96x96" }]
      }
    ],
    related_applications: [],
    prefer_related_applications: false,
    splash_pages: null
  };
}
