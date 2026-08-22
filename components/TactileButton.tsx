"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/helpers/classname-helper";

export type TactileButtonProps = {
  children: React.ReactNode;
  className?: string;
  depth?: "shallow" | "deep";
  href?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function TactileButton({
  children,
  className,
  depth = "shallow",
  href,
  onClick,
  size = "sm",
  type = "button",
  disabled = false,
}: TactileButtonProps) {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
    md: "px-4 py-2 text-sm gap-2 rounded-xl",
    lg: "px-6 py-3 text-base gap-2.5 rounded-2xl",
  }[size];

  const depthClasses =
    depth === "shallow"
      ? "shadow-[0_2px_0_0_rgba(0,0,0,0.35)] active:shadow-none active:translate-y-[2px]"
      : "shadow-[0_4px_0_0_rgba(0,0,0,0.45)] active:shadow-none active:translate-y-[4px]";

  const baseClasses = cn(
    "relative inline-flex items-center justify-center font-medium border border-neutral-700/60 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer select-none",
    sizeClasses,
    depthClasses,
    disabled && "opacity-50 pointer-events-none cursor-not-allowed",
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}
