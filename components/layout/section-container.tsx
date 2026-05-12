import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  isFullWidth?: boolean;
}

export const SectionContainer = forwardRef<HTMLElement, SectionContainerProps>(({
  children,
  className,
  id,
  isFullWidth = false,
  style,
  ...props
}, ref) => {
  return (
    <section
      ref={ref}
      id={id}
      {...props}
      className={cn(
        "w-full py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center relative",
        className
      )}
      style={style}
    >
      <div
        className={cn(
          "w-full px-4 md:px-8 lg:px-16",
          !isFullWidth && "max-w-[1440px] mx-auto"
        )}
      >
        {children}
      </div>
    </section>
  );
});

SectionContainer.displayName = "SectionContainer";
