import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Target, Heart, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DynamicLeadership } from "./dynamic-leadership";

export const metadata = {
  title: "Leadership - MDPU",
  description: "Meet the dedicated leaders of the Mathamba Descendants Progressive Union who guide our organization and serve our community.",
};

export default function LeadershipPage() {
  return (
    <>
      {/* Leadership Hero - Orange/Red Theme */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-600 to-rose-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Meet Our Leaders</span>
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Our Leadership
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-orange-100 mb-6 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              The dedicated individuals who guide the Mathamba Descendants Progressive Union and work tirelessly to serve our community and advance our mission.
            </p>
          </div>
        </div>
      </div>

      {/* Executive Committee */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Executive Committee
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The executive leadership team responsible for the day-to-day operations and strategic direction of MDPU
            </p>
          </div>

          <DynamicLeadership category="executive" />
        </div>
      </Section>

      {/* Board of Directors */}
      <Section background="muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Board of Directors
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our board members provide strategic oversight and expertise in key areas of our organization
            </p>
          </div>

          <DynamicLeadership category="board" />
        </div>
      </Section>

      {/* Chapter Leaders */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Chapter Leaders
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Leaders of our international chapters who coordinate local activities and represent their communities
            </p>
          </div>

          <DynamicLeadership category="chapter" />
        </div>
      </Section>

      {/* Leadership Principles */}
      <Section background="brand">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Our Leadership Principles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The values and principles that guide our leaders in serving the MDPU community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Service</h3>
              <p className="text-gray-600 text-sm">
                We lead by serving our community with humility and dedication
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-brand-clay rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">
                We strive for the highest standards in all our endeavors
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-brand-charcoal" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Vision</h3>
              <p className="text-gray-600 text-sm">
                We lead with a clear vision for the future of our community
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Integrity</h3>
              <p className="text-gray-600 text-sm">
                We lead with honesty, transparency, and moral courage
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Contact Leadership */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
            Connect with Our Leadership
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Our leaders are accessible and committed to hearing from members. Reach out to them with questions, suggestions, or concerns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-charcoal">General Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@mdpu.org" className="hover:text-brand-forest transition-colors">
                    info@mdpu.org
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-brand-charcoal">Executive Committee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:executive@mdpu.org" className="hover:text-brand-forest transition-colors">
                    executive@mdpu.org
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-brand-charcoal">Board of Directors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:board@mdpu.org" className="hover:text-brand-forest transition-colors">
                    board@mdpu.org
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-brand-forest hover:bg-brand-forest/90">
              <Link href="/contact">
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white">
              <Link href="/apply">
                <ArrowRight className="w-5 h-5 mr-2" />
                Join Our Community
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
