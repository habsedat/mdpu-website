"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, ExternalLink, Heart, Users, Home } from "lucide-react";

export function LocationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-brand-sand to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-forest rounded-full mb-6">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-brand-charcoal mb-4">
            Our Ancestral Home
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the beautiful village of Matamba, Sierra Leone - the heart of our heritage and the foundation of our community's strength.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Map Container */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <Card className="overflow-hidden shadow-2xl border-0 bg-white">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Map Loading Overlay */}
                  {!mapLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-forest to-brand-clay flex items-center justify-center z-10">
                      <div className="text-center text-white">
                        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-lg font-semibold">Loading Matamba...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Google Map Embed */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.123456789!2d-11.5043432!3d8.7619929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf06db6efd961b1d%3A0x95a3833503c1f871!2sMatamba%2C%20Sierra%20Leone!5e0!3m2!1sen!2sus!4v1699123456789!5m2!1sen!2sus"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={handleMapLoad}
                    className="transition-all duration-500"
                  />
                  
                  {/* Map Overlay Info */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-brand-forest rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-brand-charcoal">Matamba Village</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <div className={`space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Village Info Card */}
            <Card className="border-l-4 border-l-brand-forest shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Home className="w-6 h-6 text-brand-forest" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-charcoal mb-2">
                      Matamba Village
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Located in the heart of Sierra Leone, Matamba is more than just a place on the map - 
                      it's the ancestral home that connects all Mathamba descendants worldwide. This beautiful 
                      village represents our roots, our heritage, and the foundation of our community's strength.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-brand-forest/10 text-brand-forest text-sm rounded-full">
                        Ancestral Home
                      </span>
                      <span className="px-3 py-1 bg-brand-clay/10 text-brand-clay text-sm rounded-full">
                        Cultural Heritage
                      </span>
                      <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-sm rounded-full">
                        Community Center
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coordinates & Details */}
            <Card className="bg-gradient-to-r from-brand-forest to-brand-clay text-white shadow-lg">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  Location Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Coordinates:</p>
                    <p className="opacity-90">8.761972°N, 11.494022°W</p>
                  </div>
                  <div>
                    <p className="font-semibold">Region:</p>
                    <p className="opacity-90">Sierra Leone</p>
                  </div>
                  <div>
                    <p className="font-semibold">Climate:</p>
                    <p className="opacity-90">Tropical</p>
                  </div>
                  <div>
                    <p className="font-semibold">Population:</p>
                    <p className="opacity-90">Village Community</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                className="bg-brand-forest hover:bg-brand-forest/90 text-white flex-1"
              >
                <a 
                  href="https://www.google.com/maps/place/Matamba,+Sierra+Leone/@8.7619929,-11.5043432,3580m/data=!3m2!1e3!4b1!4m6!3m5!1s0xf06db6efd961b1d:0x95a3833503c1f871!8m2!3d8.761972!4d-11.494022!16s%2Fg%2F1v29dcsc?entry=ttu&g_ep=EgoyMDI1MDkxMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Google Maps
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white flex-1"
              >
                <Heart className="w-4 h-4 mr-2" />
                Our Heritage
              </Button>
            </div>

            {/* Community Connection */}
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-brand-forest/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-brand-gold/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-brand-gold" />
                </div>
                <h4 className="text-lg font-semibold text-brand-charcoal">
                  Global Connection
                </h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                While Matamba is our ancestral home, our community spans across the globe. 
                From this small village in Sierra Leone, Mathamba descendants have built 
                connections in London, New York, Toronto, and beyond, creating a powerful 
                network of support and unity.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <blockquote className="text-2xl font-semibold text-brand-charcoal italic max-w-4xl mx-auto leading-relaxed">
            "From the heart of Matamba to the corners of the world, we carry our heritage with pride and build bridges of unity."
          </blockquote>
          <p className="text-brand-forest font-medium mt-4">- MDPU Community</p>
        </div>
      </div>
    </section>
  );
}
