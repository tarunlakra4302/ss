import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LoadingProvider } from "@/features/homepage/loading-context";
import { FooterWrapper } from "@/components/footer-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sustainable Sundays",
  description: "Sustainable Sundays",
  icons: {
    icon: "/image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" as="image" href="/ss%20preloader%20images/1.jpeg" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-black font-sans relative">
        <LoadingProvider>
          {children}
          <FooterWrapper />
        </LoadingProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}


