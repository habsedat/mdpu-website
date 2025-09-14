import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { ProjectCard } from "@/components/ui/custom/ProjectCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Heart, Award, ArrowRight, Filter } from "lucide-react";
import "./our-projects.css";
import Link from "next/link";

export const metadata = {
  title: "Projects - MDPU",
  description: "Explore the impactful projects and initiatives of the Mathamba Descendants Progressive Union that are making a difference in our communities.",
};

// Sample projects data - in a real app, this would come from a CMS or API
const allProjects = [
  {
    title: "Community Education Initiative",
    description: "Providing educational resources, school supplies, and support to underserved communities in Sierra Leone. This project focuses on improving access to quality education for children and adults.",
    status: "active" as const,
    location: "Freetown, Sierra Leone",
    startDate: "January 2024",
    endDate: "December 2024",
    participants: 150,
    slug: "community-education-initiative",
  },
  {
    title: "Youth Development Program",
    description: "Empowering young people through skills training, mentorship programs, and leadership development. This initiative prepares the next generation for success.",
    status: "active" as const,
    location: "Multiple Locations",
    startDate: "March 2024",
    endDate: "March 2025",
    participants: 75,
    slug: "youth-development-program",
  },
  {
    title: "Healthcare Access Project",
    description: "Improving healthcare access in rural communities through mobile clinics, health education, and medical supply distribution.",
    status: "planned" as const,
    location: "Rural Sierra Leone",
    startDate: "June 2024",
    endDate: "June 2025",
    participants: 0,
    slug: "healthcare-access-project",
  },
  {
    title: "Cultural Heritage Documentation",
    description: "Preserving and documenting the rich cultural heritage of Mathamba descendants through oral history collection and digital archiving.",
    status: "active" as const,
    location: "Global",
    startDate: "September 2023",
    endDate: "September 2024",
    participants: 25,
    slug: "cultural-heritage-documentation",
  },
  {
    title: "Economic Empowerment Initiative",
    description: "Supporting entrepreneurship and economic development through micro-loans, business training, and mentorship programs.",
    status: "completed" as const,
    location: "Freetown, Sierra Leone",
    startDate: "January 2023",
    endDate: "December 2023",
    participants: 40,
    slug: "economic-empowerment-initiative",
  },
  {
    title: "Digital Literacy Program",
    description: "Teaching essential digital skills to community members, including computer basics, internet usage, and online safety.",
    status: "active" as const,
    location: "Freetown, Sierra Leone",
    startDate: "February 2024",
    endDate: "February 2025",
    participants: 60,
    slug: "digital-literacy-program",
  },
];

const projectStats = [
  {
    value: "15",
    label: "Total Projects",
    description: "Active and completed initiatives",
    icon: <Target className="w-6 h-6" />,
  },
  {
    value: "350+",
    label: "People Served",
    description: "Direct beneficiaries of our projects",
    icon: <Users className="w-6 h-6" />,
  },
  {
    value: "$75K",
    label: "Funds Invested",
    description: "Total investment in community development",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    value: "8",
    label: "Communities Impacted",
    description: "Locations where we've made a difference",
    icon: <Award className="w-6 h-6" />,
  },
];

export default function Projects() {
  const activeProjects = allProjects.filter(project => project.status === "active");
  const completedProjects = allProjects.filter(project => project.status === "completed");
  const plannedProjects = allProjects.filter(project => project.status === "planned");

  return (
    <>
      <PageHero
        title="Our Projects"
        subtitle="Making a Difference"
        description="Explore the impactful projects and initiatives that are transforming communities and creating opportunities for Mathamba descendants worldwide."
      />

      {/* Project Statistics */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See the measurable impact of our projects and initiatives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projectStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-brand-forest">
                      {stat.icon}
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-brand-charcoal">
                    {stat.value}
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold text-brand-charcoal">
                    {stat.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Active Projects */}
      <Section background="muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Active Projects
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Currently running projects that are making a positive impact in our communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeProjects.map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>
        </div>
      </Section>

      {/* Completed Projects */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Completed Projects
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Successfully completed projects that have made a lasting impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedProjects.map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>
        </div>
      </Section>

      {/* Planned Projects */}
      <Section background="brand">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Upcoming Projects
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Exciting new initiatives we're planning to launch soon
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plannedProjects.map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>
        </div>
      </Section>

      {/* Project Categories */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Our Focus Areas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The key areas where we concentrate our efforts and resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-brand-forest" />
                </div>
                <CardTitle className="text-brand-charcoal">Education</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Improving access to quality education and supporting students at all levels
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-clay/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-brand-clay" />
                </div>
                <CardTitle className="text-brand-charcoal">Youth Development</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Empowering young people through skills training and leadership development
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-brand-gold" />
                </div>
                <CardTitle className="text-brand-charcoal">Healthcare</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Improving healthcare access and promoting health education in communities
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-brand-forest" />
                </div>
                <CardTitle className="text-brand-charcoal">Economic Development</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Supporting entrepreneurship and creating economic opportunities
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section background="muted">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
            Support Our Projects
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Help us continue making a positive impact in our communities. Your support enables us to launch new projects and expand existing ones.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-brand-forest hover:bg-brand-forest/90">
              <Link href="/donate">
                <Heart className="w-5 h-5 mr-2" />
                Donate to Projects
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white">
              <Link href="/membership">
                <Users className="w-5 h-5 mr-2" />
                Join Our Mission
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal">
              <Link href="/contact">
                <ArrowRight className="w-5 h-5 mr-2" />
                Partner With Us
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
