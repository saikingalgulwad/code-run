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

  icons: {
    icon: [
      { url: "favicon.svg" },
     
    ],
   
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
  
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Head>
        {/* Primary SEO */}
        <title>Code Run - Online Code Editor & Compiler</title>
        <meta
          name="description"
          content="Code Run is a free online code editor to run JavaScript, Python, C, C++, and Java in your browser. No installation required!"
        />
        <meta
          name="keywords"
          content="online code editor, run python online, javascript compiler, free IDE, code playground, online compiler"
        />
        <meta name="author" content="Code Run" />

        {/* OpenGraph for social media */}
        <meta property="og:title" content="Code Run - Online Code Editor" />
        <meta
          property="og:description"
          content="Run JavaScript, Python, C, and Java instantly in your browser. Simple, fast, and free online compiler."
        />
        <meta property="og:url" content="https://code-run-sigma.vercel.app" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://code-run-sigma.vercel.app/preview.png"
        />

        {/* Twitter Card (for better sharing on Twitter/X) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Code Run - Free Online Code Editor" />
        <meta
          name="twitter:description"
          content="Run JavaScript, Python, and more instantly in your browser."
        />
        <meta
          name="twitter:image"
          content="https://code-run-sigma.vercel.app/preview.png"
        />

        {/* Mobile friendly */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://code-run-sigma.vercel.app" />
      </Head>
        {children}
      </body>
    </html>
  );
}
