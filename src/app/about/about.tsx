import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { LocationSection } from "@/components/ui/custom/LocationSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart, Calendar, MapPin, Award, Globe } from "lucide-react";
import "./about-us.css";

export const metadata = {
  title: "About Us - MDPU",
  description: "Learn about the Mathamba Descendants Progressive Union, our history, mission, and commitment to building stronger communities.",
};

export default function About() {
  return (
    <>
      {/* About Hero - Violet/Lavender Theme */}
      <div className="relative bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Our Story</span>
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              About MDPU
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-violet-100 mb-6 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Learn about the Mathamba Descendants Progressive Union and our commitment to building stronger communities through togetherness and unity.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The Mathamba Descendants Progressive Union (MDPU) was founded with a simple yet powerful vision: 
                  to unite the descendants of Mathamba in a progressive movement that celebrates our shared heritage 
                  while building a brighter future for our communities.
                </p>
                <p>
                  Born from the belief that "Togetherness is Strength," MDPU has grown from a small group of 
                  committed individuals to a thriving organization with chapters across the globe. Our members 
                  span from Freetown to London, New York to Toronto, creating a powerful network of support 
                  and collaboration.
                </p>
                <p>
                  Today, we continue to honor our ancestors while working tirelessly to create opportunities 
                  for education, economic development, and social progress in our communities.
                </p>
              </div>
            </div>
            
            <div className="bg-brand-sand p-8 rounded-lg">
              <h3 className="text-xl font-bold text-brand-charcoal mb-4">
                Our Motto
              </h3>
              <blockquote className="text-2xl font-semibold text-brand-forest italic text-center">
                "Togetherness is Strength"
              </blockquote>
              <p className="text-gray-600 text-center mt-4">
                This guiding principle shapes everything we do as an organization.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Our Ancestral Home - Matamba Village */}
      <LocationSection />

      {/* Our Mission & Vision */}
      <Section background="muted">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-brand-forest">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-charcoal">
                  <Target className="w-6 h-6 mr-3 text-brand-forest" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 leading-relaxed">
                  To unite Mathamba descendants worldwide in a progressive movement that promotes education, 
                  economic development, cultural preservation, and social justice. We strive to build stronger 
                  communities through mutual support, collaboration, and the celebration of our shared heritage.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-brand-gold">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-charcoal">
                  <Globe className="w-6 h-6 mr-3 text-brand-gold" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 leading-relaxed">
                  To create a world where Mathamba descendants are empowered, educated, and economically 
                  prosperous, while maintaining strong connections to their heritage and contributing 
                  positively to their communities both locally and globally.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Our Values */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide our actions and decisions as an organization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-brand-forest" />
                </div>
                <CardTitle className="text-brand-charcoal">Unity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  We believe in the power of coming together as one community, 
                  supporting each other through challenges and celebrating our successes together.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-clay/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-brand-clay" />
                </div>
                <CardTitle className="text-brand-charcoal">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  We strive for the highest standards in everything we do, from our 
                  educational programs to our community development initiatives.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-brand-gold" />
                </div>
                <CardTitle className="text-brand-charcoal">Service</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  We are committed to serving our communities with compassion, 
                  integrity, and a genuine desire to make a positive impact.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-brand-forest" />
                </div>
                <CardTitle className="text-brand-charcoal">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  We embrace innovation and forward-thinking approaches to address 
                  the evolving needs of our communities and members.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-clay/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-brand-clay" />
                </div>
                <CardTitle className="text-brand-charcoal">Heritage</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  We honor and preserve our cultural traditions while building 
                  bridges between generations and across borders.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-brand-gold" />
                </div>
                <CardTitle className="text-brand-charcoal">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  We foster strong, supportive communities that provide opportunities 
                  for growth, learning, and mutual assistance.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Contact Information */}
      <Section background="brand">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Ready to learn more about MDPU or join our community? We'd love to hear from you.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Our Office</h3>
              <p className="text-gray-600 text-sm">
                19n Thompson Bay,<br />
                off Wilkinson Road,<br />
                Freetown, Sierra Leone
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Meeting Schedule</h3>
              <p className="text-gray-600 text-sm">
                General Meetings:<br />
                First Sunday of each month<br />
                Executive Meetings:<br />
                Bi-weekly
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Join Us</h3>
              <p className="text-gray-600 text-sm">
                Become part of our growing<br />
                community of progressive<br />
                Mathamba descendants
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
