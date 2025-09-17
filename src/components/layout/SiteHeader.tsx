"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Users, Heart } from "lucide-react";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Objectives", href: "/objectives" },
  { name: "Leadership", href: "/leadership" },
  { name: "Projects", href: "/projects" },
  { name: "Events", href: "/events" },
  { name: "Chapters", href: "/chapters" },
  { name: "Location", href: "/about#location" },
  { name: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Function to check if a navigation item is active
  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/mdpu logo.png" 
                alt="MDPU - Mathamba Descendants Progressive Union" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-gray-800">MDPU</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative transition-all duration-300 font-medium px-4 py-2 rounded-lg group ${
                    active
                      ? "bg-brand-primary text-white shadow-lg font-semibold border-2 border-brand-gold"
                      : "text-gray-700 hover:text-brand-primary hover:bg-brand-gold/20 hover:shadow-md hover:border hover:border-brand-gold/30"
                  }`}
                >
                  {item.name}
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/membership">
                <Users className="w-4 h-4 mr-2" />
                Join
              </Link>
            </Button>
            <Button asChild>
              <Link href="/donate">
                <Heart className="w-4 h-4 mr-2" />
                Donate
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative transition-all duration-300 font-medium px-4 py-3 rounded-lg group ${
                      active
                        ? "bg-brand-primary text-white shadow-lg font-semibold border-2 border-brand-gold"
                        : "text-gray-700 hover:text-brand-primary hover:bg-brand-gold/20 hover:shadow-md hover:border hover:border-brand-gold/30"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                    {active && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/membership">
                    <Users className="w-4 h-4 mr-2" />
                    Join
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/donate">
                    <Heart className="w-4 h-4 mr-2" />
                    Donate
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

