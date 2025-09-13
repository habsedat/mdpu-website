import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, Heart, Award, Globe, BookOpen, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Our Objectives - MDPU",
  description: "Learn about the core objectives and aims of the Mathamba Descendants Progressive Union as outlined in our constitution.",
};

const mainObjectives = [
  {
    title: "Promote Unity and Solidarity",
    description: "Foster a strong sense of community and mutual support among Mathamba descendants worldwide, regardless of geographical location or background.",
    icon: <Users className="w-6 h-6" />,
    details: [
      "Organize regular meetings and social gatherings",
      "Facilitate networking opportunities among members",
      "Promote cultural exchange and understanding",
      "Support members during times of need",
    ],
  },
  {
    title: "Educational Development",
    description: "Support and promote educational opportunities for members and their families, with a focus on academic excellence and lifelong learning.",
    icon: <BookOpen className="w-6 h-6" />,
    details: [
      "Provide scholarships and educational grants",
      "Organize educational workshops and seminars",
      "Support school infrastructure projects",
      "Promote literacy and digital skills development",
    ],
  },
  {
    title: "Economic Empowerment",
    description: "Create opportunities for economic advancement through business development, skills training, and financial literacy programs.",
    icon: <Award className="w-6 h-6" />,
    details: [
      "Facilitate micro-loan programs",
      "Provide business development training",
      "Create employment opportunities",
      "Support entrepreneurship initiatives",
    ],
  },
  {
    title: "Cultural Preservation",
    description: "Preserve, promote, and celebrate the rich cultural heritage of Mathamba descendants for future generations.",
    icon: <Globe className="w-6 h-6" />,
    details: [
      "Document oral histories and traditions",
      "Organize cultural festivals and events",
      "Support traditional arts and crafts",
      "Create cultural education programs",
    ],
  },
  {
    title: "Community Development",
    description: "Contribute to the overall development of communities where Mathamba descendants live and work.",
    icon: <Target className="w-6 h-6" />,
    details: [
      "Support infrastructure development projects",
      "Provide healthcare access initiatives",
      "Organize community service activities",
      "Promote environmental sustainability",
    ],
  },
  {
    title: "Social Justice Advocacy",
    description: "Advocate for social justice, equality, and human rights, both within our communities and in society at large.",
    icon: <Heart className="w-6 h-6" />,
    details: [
      "Support human rights initiatives",
      "Advocate for equal opportunities",
      "Promote gender equality",
      "Fight against discrimination and prejudice",
    ],
  },
];

const constitutionHighlights = [
  {
    section: "Article I - Name and Purpose",
    content: "The organization shall be known as the Mathamba Descendants Progressive Union (MDPU), established to promote unity, progress, and mutual support among Mathamba descendants worldwide.",
  },
  {
    section: "Article II - Membership",
    content: "Membership is open to all descendants of Mathamba who support the organization's objectives and agree to abide by its constitution and bylaws.",
  },
  {
    section: "Article III - Governance",
    content: "The organization shall be governed by an Executive Committee elected by the general membership, with regular meetings and transparent decision-making processes.",
  },
  {
    section: "Article IV - Financial Management",
    content: "All financial activities shall be conducted with transparency, accountability, and in accordance with established financial policies and procedures.",
  },
];

export default function Objectives() {
  return (
    <>
      <PageHero
        title="Our Objectives"
        subtitle="Our Mission & Goals"
        description="The core objectives and aims that guide the Mathamba Descendants Progressive Union in our mission to build stronger communities and preserve our heritage."
      />

      {/* Main Objectives */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Our Core Objectives
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These fundamental objectives guide all our activities and initiatives as an organization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainObjectives.map((objective, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mb-4">
                    <div className="text-brand-forest">
                      {objective.icon}
                    </div>
                  </div>
                  <CardTitle className="text-brand-charcoal">{objective.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {objective.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {objective.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-brand-forest rounded-full mt-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Constitution Highlights */}
      <Section background="muted">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Constitution Highlights
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key sections from our constitution that outline our organizational structure and principles
            </p>
          </div>
          
          <div className="space-y-6">
            {constitutionHighlights.map((highlight, index) => (
              <Card key={index} className="border-l-4 border-l-brand-forest">
                <CardHeader>
                  <CardTitle className="text-brand-charcoal">{highlight.section}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {highlight.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Our Motto */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-brand-sand p-12 rounded-lg">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
              Our Guiding Principle
            </h2>
            <blockquote className="text-4xl font-bold text-brand-forest italic mb-6">
              "Togetherness is Strength"
            </blockquote>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              This powerful motto encapsulates our belief that unity, collaboration, and mutual support 
              are the foundations of progress and success. It guides every decision we make and every 
              initiative we undertake as an organization.
            </p>
          </div>
        </div>
      </Section>

      {/* Strategic Priorities */}
      <Section background="brand">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Strategic Priorities (2024-2026)
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our focus areas for the next three years to maximize our impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-charcoal mb-2">Member Growth</h3>
              <p className="text-gray-600 text-sm">
                Increase membership to 1,000+ active members across all chapters
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-clay rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-charcoal mb-2">Education Impact</h3>
              <p className="text-gray-600 text-sm">
                Support 100+ students with scholarships and educational programs
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-brand-charcoal" />
              </div>
              <h3 className="text-xl font-bold text-brand-charcoal mb-2">Economic Development</h3>
              <p className="text-gray-600 text-sm">
                Launch 25+ business development and micro-loan programs
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-charcoal mb-2">Global Reach</h3>
              <p className="text-gray-600 text-sm">
                Establish 5+ new chapters in major diaspora communities
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
            Ready to Support Our Mission?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join us in achieving these objectives and making a positive impact in our communities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-brand-forest hover:bg-brand-forest/90">
              <Link href="/membership">
                <Users className="w-5 h-5 mr-2" />
                Become a Member
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white">
              <Link href="/constitution">
                <Download className="w-5 h-5 mr-2" />
                Download Full Constitution
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal">
              <Link href="/donate">
                <Heart className="w-5 h-5 mr-2" />
                Support Our Mission
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
