import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Our Universe — Couple Journal",
  description:
    "A private, beautiful space for couples to capture memories, write letters to the future, and celebrate their love story.",
  keywords: "couple journal, relationship, memories, love, private diary",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Our Universe",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#060614] text-white antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1, touchAction: 'pan-y' }}>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
