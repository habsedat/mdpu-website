import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { Stat } from "@/components/ui/custom/Stat";
import { CTAButtons } from "@/components/ui/custom/CTAButtons";
import { ProjectCard } from "@/components/ui/custom/ProjectCard";
import { EventCard } from "@/components/ui/custom/EventCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import "./home-page.css";
import Link from "next/link";

// Sample data - in a real app, this would come from a CMS or API
const featuredProjects = [
  {
    title: "Community Education Initiative",
    description: "Providing educational resources and support to underserved communities in Sierra Leone.",
    status: "active" as const,
    location: "Freetown, Sierra Leone",
    startDate: "January 2024",
    participants: 150,
    slug: "community-education-initiative",
  },
  {
    title: "Youth Development Program",
    description: "Empowering young people through skills training and mentorship programs.",
    status: "active" as const,
    location: "Multiple Locations",
    startDate: "March 2024",
    participants: 75,
    slug: "youth-development-program",
  },
  {
    title: "Healthcare Access Project",
    description: "Improving healthcare access in rural communities through mobile clinics.",
    status: "planned" as const,
    location: "Rural Sierra Leone",
    startDate: "June 2024",
    participants: 0,
    slug: "healthcare-access-project",
  },
];

const nextMeeting = {
  title: "Monthly General Meeting",
  description: "Join us for our monthly general meeting to discuss union activities and upcoming projects.",
  date: "Sunday, February 4, 2024",
  time: "2:00 PM - 4:00 PM",
  location: "19n Thompson Bay, off Wilkinson Road, Freetown",
  type: "general" as const,
  slug: "february-2024-general-meeting",
};

const objectives = [
  "Promote unity and solidarity among Mathamba descendants",
  "Support educational and economic development initiatives",
  "Preserve and celebrate our cultural heritage",
  "Provide mutual aid and support to members",
  "Advocate for social justice and community development",
];

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section - Custom Design */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Building Stronger Communities</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent leading-tight">
              Mathamba Descendants Progressive Union
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-cyan-100 mb-6 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Togetherness is Strength - Join us in building a progressive union that empowers our community and preserves our heritage for future generations.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
                <Link href="/membership">
                  <Users className="w-5 h-5 mr-2" />
                  Join Our Union
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Link href="/donate">
                  <Heart className="w-5 h-5 mr-2" />
                  Support Our Mission
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <Section background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how MDPU is making a difference in our communities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Stat
            value="500+"
            label="Active Members"
            description="Growing community of Mathamba descendants"
            icon={<Users className="w-6 h-6" />}
          />
          <Stat
            value="15"
            label="Active Projects"
            description="Community development initiatives"
            icon={<Target className="w-6 h-6" />}
          />
          <Stat
            value="8"
            label="Chapters Worldwide"
            description="From Freetown to the diaspora"
            icon={<MapPin className="w-6 h-6" />}
          />
          <Stat
            value="$50K+"
            label="Funds Raised"
            description="For community development projects"
            icon={<Heart className="w-6 h-6" />}
          />
        </div>
      </Section>

      {/* Featured Projects */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the impactful work we&apos;re doing in our communities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Next Meeting */}
      <Section background="brand">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Next Meeting
            </h2>
            <p className="text-gray-600">
              Join us for our monthly general meeting
            </p>
          </div>
          
          <EventCard {...nextMeeting} className="max-w-2xl mx-auto" />
        </div>
      </Section>

      {/* Our Objectives */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Our Objectives
            </h2>
            <p className="text-gray-600">
              The core principles that guide our mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((objective, index) => (
              <Card key={index} className="border-l-4 border-l-brand-forest">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {objective}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
              <Link href="/objectives">
                Read Our Full Constitution
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section background="muted">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join the Mathamba Descendants Progressive Union and be part of our mission to build stronger communities through togetherness and unity.
          </p>
          
          <CTAButtons variant="hero" />
        </div>
      </Section>
    </div>
  );
}
