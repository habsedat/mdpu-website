import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Heart, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

interface CTAButtonsProps {
  variant?: "default" | "hero" | "inline";
  className?: string;
}

export function CTAButtons({ variant = "default", className }: CTAButtonsProps) {
  const baseClasses = "flex flex-col sm:flex-row gap-4";
  const variantClasses = {
    default: "justify-start",
    hero: "justify-center",
    inline: "justify-center",
  };

  const buttonSize = variant === "hero" ? "lg" : "default";

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`}>
      <Button size={buttonSize} asChild className="bg-brand-gold hover:bg-brand-gold/90 text-brand-charcoal">
        <Link href="/membership">
          <Users className="w-4 h-4 mr-2" />
          Join Our Union
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </Button>
      
      <Button size={buttonSize} variant="outline" asChild className="border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white">
        <Link href="/donate">
          <Heart className="w-4 h-4 mr-2" />
          Donate
        </Link>
      </Button>
      
      <Button size={buttonSize} variant="ghost" asChild className="text-brand-charcoal hover:bg-brand-sand">
        <Link href="/events">
          <Calendar className="w-4 h-4 mr-2" />
          Upcoming Events
        </Link>
      </Button>
    </div>
  );
}

