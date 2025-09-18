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
  title: "Saiprasad Code | Online JavaScript & Python Code Editor",
  description: "Saiprasad Code is a free online code editor for JavaScript and Python. Write, run, and share your code instantly in a sleek, dark-themed editor designed for developers. Perfect for learning, testing, and building projects online."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
  <link rel="icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon-32x32.png" />
  <meta name="theme-color" content="#4F46E5" />
</Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
