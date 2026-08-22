"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { useLoading } from "@/features/homepage/loading-context";

export function FooterWrapper() {
  const pathname = usePathname();
  const { isComplete } = useLoading();

  // Do not show footer on contact, success pages or while preloader is active
  if (
    pathname === "/contact" ||
    pathname?.startsWith("/event/success") ||
    pathname?.startsWith("/donate/success")
  ) {
    return null;
  }

  return <Footer />;
}
