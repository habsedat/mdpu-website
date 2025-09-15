import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatProps {
  value: string | number;
  label: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  variant?: "default" | "brand" | "accent";
}

export function Stat({
  value,
  label,
  description,
  icon,
  className,
  variant = "default",
}: StatProps) {
  const variantClasses = {
    default: "text-brand-charcoal",
    brand: "text-brand-forest",
    accent: "text-brand-gold",
  };

  return (
    <div className={cn("text-center", className)}>
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center text-brand-forest">
            {icon}
          </div>
        </div>
      )}
      
      <div className={cn("text-3xl md:text-4xl font-bold mb-2", variantClasses[variant])}>
        {value}
      </div>
      
      <div className="text-lg font-semibold text-brand-charcoal mb-2">
        {label}
      </div>
      
      {description && (
        <p className="text-gray-600 text-sm max-w-xs mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

