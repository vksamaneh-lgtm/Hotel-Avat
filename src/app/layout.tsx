import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/context/LanguageContext";
import { UtmTracker } from "@/components/UtmTracker";
import { hotelConfig } from "@/config/hotel.config";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0494D6" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(hotelConfig.meta.siteUrl),
  title: hotelConfig.meta.metaTitleFa,
  description: hotelConfig.meta.metaDescriptionFa,
  keywords: hotelConfig.meta.keywordsFa,
  icons: {
    icon: "/images/avat-logo.jpg",
    shortcut: "/images/avat-logo.jpg",
    apple: "/images/avat-logo.jpg",
  },
  openGraph: {
    title: hotelConfig.meta.metaTitleFa,
    description: hotelConfig.meta.metaDescriptionFa,
    images: [hotelConfig.meta.ogImage],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <head>
        {/* Google Fonts - Estedad (weights 100 to 900) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Estedad:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased selection:bg-[#e7f6fc] selection:text-[#0494D6]">
        <LanguageProvider>
          <UtmTracker />
          {children}
          <Toaster richColors position="top-center" />
        </LanguageProvider>
      </body>
    </html>
  );
}

