import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Users, Target, Award, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Constitution - MDPU",
  description: "Read the complete constitution of the Mathamba Descendants Progressive Union, outlining our mission, structure, and governance principles.",
};

const constitutionSections = [
  {
    title: "Article I - Name and Purpose",
    content: `The organization shall be known as the Mathamba Descendants Progressive Union (MDPU), established to promote unity, progress, and mutual support among Mathamba descendants worldwide.

The purpose of this organization is to:
- Foster unity and solidarity among Mathamba descendants
- Promote educational and economic development
- Preserve and celebrate our cultural heritage
- Provide mutual aid and support to members
- Advocate for social justice and community development`,
  },
  {
    title: "Article II - Membership",
    content: `Membership in the MDPU is open to all descendants of Mathamba who:
- Support the organization's objectives and values
- Agree to abide by this constitution and bylaws
- Pay required membership dues (if applicable)
- Participate actively in organization activities

Membership categories include:
- Regular Members: Full voting rights and participation
- Supporting Members: Financial supporters with limited voting rights
- Honorary Members: Recognized for exceptional service

Membership may be terminated for violation of the constitution, bylaws, or code of conduct.`,
  },
  {
    title: "Article III - Governance Structure",
    content: `The organization shall be governed by:

1. General Assembly: The supreme decision-making body consisting of all members
2. Executive Committee: Day-to-day operations and implementation
3. Board of Directors: Strategic oversight and policy guidance
4. Chapter Leadership: Local chapter management and coordination

The Executive Committee shall consist of:
- President
- Vice President
- Secretary General
- Treasurer
- Additional officers as needed

All officers shall be elected by the general membership for two-year terms.`,
  },
  {
    title: "Article IV - Meetings and Decision Making",
    content: `Regular Meetings:
- General meetings shall be held on the first Sunday of each month
- Executive committee meetings shall be held bi-weekly
- Board meetings shall be held quarterly
- Special meetings may be called as needed

Decision Making:
- General assembly decisions require a simple majority vote
- Constitutional amendments require a two-thirds majority
- Quorum for general meetings is 25% of active members
- Proxy voting is permitted with proper documentation

All meetings shall be conducted in accordance with democratic principles and Robert's Rules of Order.`,
  },
  {
    title: "Article V - Financial Management",
    content: `Financial Principles:
- All financial activities shall be conducted with transparency and accountability
- Annual budgets shall be prepared and approved by the general assembly
- Financial reports shall be presented quarterly
- External audits shall be conducted annually

Revenue Sources:
- Membership dues and contributions
- Fundraising activities and events
- Grants and donations
- Investment income

Expenditure Guidelines:
- Funds shall be used exclusively for organizational purposes
- Major expenditures require board approval
- Emergency funds shall be maintained for contingencies
- All expenses must be properly documented and approved`,
  },
  {
    title: "Article VI - Chapters and International Structure",
    content: `Chapter Establishment:
- New chapters may be established with a minimum of 10 members
- Chapter applications must be approved by the executive committee
- Each chapter shall have its own leadership structure
- Chapters must comply with local laws and regulations

International Coordination:
- Regular communication between chapters is required
- Annual international conferences shall be held
- Resource sharing and collaboration is encouraged
- Cultural exchange programs shall be promoted

Chapter Responsibilities:
- Organize local activities and meetings
- Recruit and retain members
- Implement organizational programs
- Report activities to headquarters regularly`,
  },
  {
    title: "Article VII - Code of Conduct and Ethics",
    content: `All members shall:
- Conduct themselves with integrity and respect
- Treat all members with dignity and fairness
- Avoid conflicts of interest
- Maintain confidentiality when required
- Promote the organization's values and mission

Prohibited Conduct:
- Discrimination based on race, gender, religion, or other protected characteristics
- Harassment or intimidation of any kind
- Misuse of organizational resources
- Violation of local, national, or international laws
- Actions that bring disrepute to the organization

Disciplinary Procedures:
- Complaints shall be investigated promptly and fairly
- Due process rights shall be respected
- Progressive discipline shall be applied
- Appeals process shall be available`,
  },
  {
    title: "Article VIII - Amendments and Dissolution",
    content: `Constitutional Amendments:
- Amendments may be proposed by any member
- Proposals must be submitted in writing 30 days before voting
- Two-thirds majority vote required for adoption
- Amendments take effect immediately upon adoption

Bylaws:
- Bylaws may be adopted or amended by simple majority vote
- Bylaws must be consistent with this constitution
- Bylaws shall be reviewed annually

Dissolution:
- Organization may be dissolved by three-fourths majority vote
- Assets shall be distributed to charitable organizations with similar purposes
- All debts and obligations must be satisfied
- Final financial report must be prepared and filed`,
  },
];

export default function Constitution() {
  return (
    <>
      <PageHero
        title="Our Constitution"
        subtitle="Governing Document"
        description="The complete constitution of the Mathamba Descendants Progressive Union, outlining our mission, structure, governance principles, and operational guidelines."
      />

      {/* Constitution Overview */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Constitution Overview
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our constitution serves as the foundational document that guides all aspects of our organization, 
              from governance structure to member responsibilities and organizational values.
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-brand-charcoal">
                <FileText className="w-6 h-6 mr-3 text-brand-forest" />
                Document Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Adopted:</strong> January 15, 2020
                </div>
                <div>
                  <strong>Last Amended:</strong> March 10, 2024
                </div>
                <div>
                  <strong>Version:</strong> 2.1
                </div>
                <div>
                  <strong>Pages:</strong> 12 pages
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button asChild className="bg-brand-forest hover:bg-brand-forest/90">
                  <Link href="/constitution.pdf" target="_blank">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Version
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Constitution Sections */}
      <Section background="muted">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {constitutionSections.map((section, index) => (
              <Card key={index} className="border-l-4 border-l-brand-forest">
                <CardHeader>
                  <CardTitle className="text-brand-charcoal">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    {section.content.split('\n').map((paragraph, pIndex) => (
                      paragraph.trim() ? (
                        <p key={pIndex} className="mb-4 text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ) : null
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Key Principles */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Key Constitutional Principles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The fundamental principles that guide our organization and decision-making processes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-brand-forest" />
                </div>
                <CardTitle className="text-brand-charcoal">Democratic Governance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  All major decisions are made through democratic processes with member participation
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-clay/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-brand-clay" />
                </div>
                <CardTitle className="text-brand-charcoal">Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Open communication and transparent decision-making processes
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-brand-gold" />
                </div>
                <CardTitle className="text-brand-charcoal">Accountability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Leaders and members are accountable for their actions and decisions
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-brand-forest" />
                </div>
                <CardTitle className="text-brand-charcoal">Inclusivity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  All members are treated with respect and have equal opportunities to participate
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Our Motto */}
      <Section background="brand">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
            Our Guiding Principle
          </h2>
          <blockquote className="text-4xl font-bold text-brand-forest italic mb-6">
            "Togetherness is Strength"
          </blockquote>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            This powerful motto, enshrined in our constitution, encapsulates our belief that unity, 
            collaboration, and mutual support are the foundations of progress and success. It guides 
            every decision we make and every initiative we undertake as an organization.
          </p>
        </div>
      </Section>

      {/* Call to Action */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
            Get Involved
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Understanding our constitution is the first step to becoming an active member of our community. 
            Join us in upholding these principles and contributing to our mission.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-brand-forest hover:bg-brand-forest/90">
              <Link href="/membership">
                <Users className="w-5 h-5 mr-2" />
                Become a Member
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white">
              <Link href="/about">
                <ArrowRight className="w-5 h-5 mr-2" />
                Learn More About Us
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal">
              <Link href="/contact">
                <FileText className="w-5 h-5 mr-2" />
                Ask Questions
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
