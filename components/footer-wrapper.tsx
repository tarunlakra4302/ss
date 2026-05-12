"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { useLoading } from "@/features/homepage/loading-context";

export function FooterWrapper() {
  const pathname = usePathname();
  const { isComplete } = useLoading();

  // Do not show footer on contact page or while preloader is active
  if (pathname === "/contact") {
    return null;
  }

  return <Footer />;
}
