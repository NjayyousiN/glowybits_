import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Header from "@/components/header";
import { Toaster } from "sonner";
import QueryClientProviderWrapper from "@/providers/queryClient";
import "./globals.css";

const poppins = Poppins({
  weight: "400",
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glowybits",
  description: "View free royalty images!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} min-h-screen`}>
        <Header />
        <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
        <Toaster richColors />
      </body>
    </html>
  );
}
