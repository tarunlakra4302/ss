import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LoadingProvider } from "@/features/homepage/loading-context";
import { FooterWrapper } from "@/components/footer-wrapper";
import { PageTransitionProvider } from "@/components/ui/page-transition";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sustainable Sundays",
  description: "Sustainable Sundays",
  icons: {
    icon: "/SS Logo_white Text clean.png",
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
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" as="image" href="/ss%20preloader%20images/1.jpeg" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/font-share/v2/css?f[]=nohemi@400,500,600,700,800,900&display=swap" />
      </head>
      <body
        className="min-h-full flex flex-col bg-white text-black font-sans relative"
        suppressHydrationWarning
      >
        <PageTransitionProvider variant="rectangle" start="bottom-up">
          <LoadingProvider>
            {children}
            <FooterWrapper />
          </LoadingProvider>
        </PageTransitionProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}


