"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Heart, Star, Shield, Globe } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [currentGradient, setCurrentGradient] = useState(0);
  const [isLeftSideBigger, setIsLeftSideBigger] = useState(true);

  // Define multiple professional gradient combinations
  const gradients = [
    "from-brand-primary via-brand-secondary to-brand-accent",
    "from-brand-secondary via-brand-accent to-brand-primary", 
    "from-brand-accent via-brand-primary to-brand-secondary",
    "from-brand-primary via-brand-accent to-brand-gold",
    "from-brand-secondary via-brand-gold to-brand-primary",
    "from-brand-gold via-brand-primary to-brand-secondary"
  ];

  // Animate gradient changes every 8 seconds
  useEffect(() => {
    const gradientInterval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 8000);

    return () => clearInterval(gradientInterval);
  }, [gradients.length]);

  // Animate layout changes every 12 seconds
  useEffect(() => {
    const layoutInterval = setInterval(() => {
      setIsLeftSideBigger((prev) => !prev);
    }, 12000);

    return () => clearInterval(layoutInterval);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center pb-16">
      {/* Animated Background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradients[currentGradient]} transition-all duration-2000 ease-in-out`}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
      >
        {backgroundImage && (
          <div className="absolute inset-0 bg-brand-primary/80 bg-blend-multiply" />
        )}
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-brand-gold/20 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-brand-accent/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-brand-gold/15 rounded-lg rotate-12 animate-bounce"></div>
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1500 ease-in-out ${
          isLeftSideBigger ? 'lg:grid-cols-[2fr_1fr]' : 'lg:grid-cols-[1fr_2fr]'
        }`}>
          
          {/* Left Content - Dynamic Size */}
          <div className={`text-white space-y-8 transition-all duration-1500 ease-in-out ${
            isLeftSideBigger ? 'lg:pr-8' : 'lg:pr-4'
          }`}>
            {subtitle && (
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Star className="w-4 h-4 text-brand-gold" />
                <p className="text-brand-gold text-sm font-medium">
                  {subtitle}
                </p>
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block bg-gradient-to-r from-white to-brand-gold bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            
            {description && (
              <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
            
            {showCTAs && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  asChild 
                  className="bg-brand-gold hover:bg-brand-gold/90 text-brand-charcoal transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Link href="/membership">
                    <Users className="w-5 h-5 mr-2" />
                    Join Our Union
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild 
                  className="border-white/30 text-white hover:bg-white hover:text-brand-charcoal backdrop-blur-sm bg-white/10 transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/donate">
                    <Heart className="w-5 h-5 mr-2" />
                    Support Our Mission
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Right Content - Dynamic Size */}
          <div className={`space-y-6 transition-all duration-1500 ease-in-out ${
            isLeftSideBigger ? 'lg:pl-4' : 'lg:pl-8'
          }`}>
            {/* Feature Cards */}
            <div className="grid gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Community Protection</h3>
                    <p className="text-gray-200 text-sm">Safeguarding our heritage</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-accent/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-brand-accent" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Global Network</h3>
                    <p className="text-gray-200 text-sm">Connecting worldwide</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-secondary/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-brand-secondary" />
                  </div>
                  <div>
                    <h3 className="text-yellow-400 font-semibold">Progressive Union</h3>
                    <p className="text-gray-200 text-sm">Building stronger communities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          className="w-full h-20 text-white" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="currentColor"
            className="opacity-25"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            fill="currentColor"
            className="opacity-50"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </section>
  );
}
