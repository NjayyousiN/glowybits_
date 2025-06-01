import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import QueryClientProviderWrapper from "@/providers/queryClient";
import "./globals.css";

const poppins = Poppins({
  weight: "400",
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlowyBits - Premium Image Hosting Platform",
  description:
    "Transform your digital memories into luminous experiences. Upload, share, and showcase your images with GlowyBits - where every pixel shines with brilliance.",
  keywords: [
    "image hosting",
    "photo sharing",
    "digital gallery",
    "cloud storage",
    "image upload",
  ],
  authors: [{ name: "GlowyBits Team" }],
  creator: "GlowyBits",
  publisher: "GlowyBits",
  robots: "index, follow",
  metadataBase: new URL("https://glowybits.uk"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "de-DE": "/de-DE",
    },
  },
  openGraph: {
    title: "GlowyBits - Image Hosting Platform",
    description:
      "Transform your digital memories into luminous experiences. Upload, share, and showcase your images with GlowyBits.",
    url: "https://glowybits.com",
    siteName: "GlowyBits",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GlowyBits - Image Hosting Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlowyBits - Image Hosting Platform",
    description: "Transform your digital memories into luminous experiences.",
    images: ["/twitter-image.png"],
    creator: "@glowybits",
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <QueryClientProviderWrapper>
          <main>{children}</main>
        </QueryClientProviderWrapper>
        <Toaster richColors expand={false} />
      </body>
    </html>
  );
}
