import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { LeadershipRoleCard } from "@/components/ui/custom/LeadershipRoleCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Target, Heart, Mail, ArrowRight } from "lucide-react";
import "./leadership-team.css";
import Link from "next/link";

export const metadata = {
  title: "Leadership - MDPU",
  description: "Meet the dedicated leaders of the Mathamba Descendants Progressive Union who guide our organization and serve our community.",
};

// Sample leadership data - in a real app, this would come from a CMS or API
const executiveCommittee = [
  {
    name: "Henry Bangura",
    position: "President",
    email: "president@mdpu.org",
    phone: "+96550389325 ",
    location: "Kuwait",
    term: "2023-2026",
    bio: "Henry Bangura brings over 15 years of experience in community development and has been instrumental in establishing MDPU's educational programs.",
  },
  {
    name: "Mohamed Sesay",
    position: "Vice President",
    email: "vicepresident@mdpu.org",
    phone: "+232 ",
    location: "Freetown, Sierra Leone",
    term: "2023-2026",
    bio: "Mohamed oversees our international operations and has successfully established chapters in the UK and Europe.",
  },
  {
    name: "Henry Koroma",
    position: "Secretary General",
    email: "secretary@mdpu.org",
    phone: "+23277371080",
    location: "Freetown, Sierra Leone",
    term: "2023-2026",
    bio: "Henry Koroma manages our administrative operations and ensures smooth communication between all chapters and members.",
  },
  {
    name: "Mariatu Kabia",
    position: "DP Secretary General",
    email: "secretary@mdpu.org",
    phone: "+23276201943",
    location: "Freetown, Sierra Leone",
    term: "2023-2026",
    bio: "Mariatu Kabia manages our administrative operations and ensures smooth communication between all chapters and members.",
  },
  {
    name: "Ibrahim Conteh",
    position: "Treasurer",
    email: "treasurer@mdpu.org",
    phone: "+232 ",
    location: "Freetown, Sierra Leone",
    term: "2023-2025",
    bio: "Ibrahim brings financial expertise from his career in banking and ensures transparent financial management of our organization.",
  },
];

const boardMembers = [
  {
    name: "Dr. Isatu Fofanah",
    position: "Board Member - Education",
    email: "education@mdpu.org",
    location: "Freetown, Sierra Leone",
    term: "2023-2026",
    bio: "Dr. Fofanah leads our educational initiatives and scholarship programs, bringing expertise from her career in academia.",
  },
  {
    name: "Alhaji Sorie Kamara",
    position: "Board Member - Cultural Affairs",
    email: "cultural@mdpu.org",
    location: "Freetown, Sierra Leone",
    term: "2023-2026",
    bio: "Alhaji Kamara is a respected elder who ensures our cultural traditions and heritage are preserved and celebrated.",
  },
  {
    name: "Mariama Koroma",
    position: "Board Member - Youth Development",
    email: "youth@mdpu.org",
    location: "Freetown, Sierra Leone",
    term: "2023-2026",
    bio: "Mariama focuses on empowering young members and creating opportunities for the next generation of leaders.",
  },
  {
    name: "Dr. Mohamed Jalloh",
    position: "Board Member - Healthcare",
    email: "healthcare@mdpu.org",
    location: "Freetown, Sierra Leone",
    term: "2023-2026",
    bio: "Dr. Jalloh oversees our healthcare initiatives and community health programs across all chapters.",
  },
];

const chapterLeaders = [
  {
    name: "Sarah ",
    position: "Chapter President - London",
    email: "london@mdpu.org",
    location: "London, UK",
    term: "2024-2026",
    bio: "Sarah leads our largest international chapter and has been instrumental in organizing successful community events.",
  },
  {
    name: "David ",
    position: "Chapter President - New York",
    email: "newyork@mdpu.org",
    location: "New York, USA",
    term: "2024-2026",
    bio: "David coordinates activities for our East Coast members and manages partnerships with local organizations.",
  },
  {
    name: "Johnson",
    position: "Chapter President - Toronto",
    email: "toronto@mdpu.org",
    location: "Toronto, Canada",
    term: "2024-2026",
    bio: "Aisha leads our Canadian chapter and focuses on youth engagement and educational programs.",
  },
];

export default function Leadership() {
  return (
    <>
      <PageHero
        title="Our Leadership"
        subtitle="Meet Our Leaders"
        description="The dedicated individuals who guide the Mathamba Descendants Progressive Union and work tirelessly to serve our community and advance our mission."
      />

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {executiveCommittee.map((leader, index) => (
              <LeadershipRoleCard key={index} {...leader} />
            ))}
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {boardMembers.map((member, index) => (
              <LeadershipRoleCard key={index} {...member} />
            ))}
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chapterLeaders.map((leader, index) => (
              <LeadershipRoleCard key={index} {...leader} />
            ))}
          </div>
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
              <Link href="/membership">
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
