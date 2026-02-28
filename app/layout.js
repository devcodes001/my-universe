import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/ToastProvider";

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
    startupImage: [
      "/icon.png",
    ],
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    title: "Our Universe — Couple Journal",
    description: "A private digital sanctuary for your love story.",
    type: "website",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#060614",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#060614] text-white antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main style={{ position: 'relative', zIndex: 1, touchAction: 'pan-y' }}>{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
