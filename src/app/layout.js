import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Code Run - Online Code Editor & Compiler",
    template: "%s | Code Run",
  },
  description:
    "Code Run is a free online code editor to run JavaScript, Python, C, C++, and Java in your browser. No installation required!",
  applicationName: "Code Run",
  authors: [{ name: "Saiprasad Algulwad", url: "https://code-run-sigma.vercel.app" }],
  publisher: "Saiprasad Algulwad",
  creator: "Saiprasad Algulwad",
  keywords: [
    "online code editor",
    "run python online",
    "javascript compiler",
    "free IDE",
    "code playground",
    "online compiler",
    "with suggestion",
  ],
  metadataBase: new URL("https://code-run-sigma.vercel.app"),
  alternates: { canonical: "https://code-run-sigma.vercel.app" },

  // ✅ Icons (your custom favicon.svg + fallbacks)
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" }, // optional fallback
    ],
    apple: [{ url: "/apple-touch-icon.png" }], // optional for iOS
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "Code Run - Online Code Editor",
    description:
      "Run JavaScript, Python, C, and Java instantly in your browser. Simple, fast, and free online compiler.",
    url: "https://code-run-sigma.vercel.app",
    siteName: "Code Run",
    images: [
      {
        url: "https://code-run-sigma.vercel.app/preview.png",
        width: 1200,
        height: 630,
        alt: "Code Run — free online code editor",
      },
    ],
    type: "website",
  },

  // Twitter card
  twitter: {
    card: "summary_large_image",
    title: "Code Run - Free Online Code Editor",
    description: "Run JavaScript, Python, and more instantly in your browser.",
    images: ["https://code-run-sigma.vercel.app/preview.png"],
  },

  // robots.txt equivalent (helps crawlers)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
  
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
    
        {children}
      </body>
    </html>
  );
}
