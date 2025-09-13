import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Heart } from "lucide-react";
import Link from "next/link";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  showCTAs?: boolean;
  backgroundImage?: string;
}

export function PageHero({
  title,
  subtitle,
  description,
  showCTAs = false,
  backgroundImage,
}: PageHeroProps) {
  return (
    <section 
      className="relative bg-gradient-to-br from-brand-forest to-brand-clay text-white py-20 lg:py-32"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-brand-forest/80 bg-blend-multiply" />
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {subtitle && (
            <p className="text-brand-gold text-lg font-medium mb-4">
              {subtitle}
            </p>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          
          {description && (
            <p className="text-xl text-gray-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              {description}
            </p>
          )}
          
          {showCTAs && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-brand-gold hover:bg-brand-gold/90 text-brand-charcoal">
                <Link href="/membership">
                  <Users className="w-5 h-5 mr-2" />
                  Join Our Union
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-brand-charcoal">
                <Link href="/donate">
                  <Heart className="w-5 h-5 mr-2" />
                  Support Our Mission
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
