import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "default" | "muted" | "brand";
  padding?: "sm" | "md" | "lg" | "xl";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl";
}

export function Section({
  children,
  className,
  background = "default",
  padding = "lg",
  maxWidth = "7xl",
}: SectionProps) {
  const backgroundClasses = {
    default: "bg-white",
    muted: "bg-gray-50",
    brand: "bg-brand-sand",
  };

  const paddingClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-20",
  };

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "7xl": "max-w-7xl",
  };

  return (
    <section className={cn(backgroundClasses[background], className)}>
      <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", maxWidthClasses[maxWidth], paddingClasses[padding])}>
        {children}
      </div>
    </section>
  );
}
