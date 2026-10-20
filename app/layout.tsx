import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LoadingProvider } from "@/features/homepage/loading-context";
import { FooterWrapper } from "@/components/footer-wrapper";
import { PageTransitionProvider } from "@/components/ui/page-transition";
import { GlobalCursorProvider } from "@/components/global-cursor-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sustainablesundays.in"),
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
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/font-share/v2/css?f[]=nohemi@400,500,600,700,800,900&display=swap" />
      </head>
      <body
        className="min-h-full flex flex-col bg-white text-black font-sans relative"
        suppressHydrationWarning
      >
        <PageTransitionProvider variant="rectangle" start="bottom-up">
          <GlobalCursorProvider>
            <LoadingProvider>
              {children}
              <FooterWrapper />
            </LoadingProvider>
          </GlobalCursorProvider>
        </PageTransitionProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}


