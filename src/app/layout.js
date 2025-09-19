import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Online Typescript Code Editor | Saiprasad Code",
  description:
    "Saiprasad Code is a free online code editor for JavaScript and Python. Write, run, and share your code instantly in a sleek, dark-themed editor designed for developers. Perfect for learning, testing, and building projects online.",
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
        {children}
      </body>
    </html>
  );
}
