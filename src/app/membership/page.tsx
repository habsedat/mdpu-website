import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { JoinForm } from "@/components/ui/custom/JoinForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Target, Award, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Membership - Join MDPU",
  description: "Join the Mathamba Descendants Progressive Union and become part of our growing community of progressive individuals working together for positive change.",
};

const membershipBenefits = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community Connection",
    description: "Connect with Mathamba descendants worldwide and build lasting relationships with like-minded individuals.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Development Opportunities",
    description: "Access to educational programs, skills training, and professional development opportunities.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Mutual Support",
    description: "Receive support during challenging times and celebrate achievements with your extended family.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Leadership Roles",
    description: "Opportunities to take on leadership positions and contribute to the organization's growth and direction.",
  },
];

const membershipTypes = [
  {
    title: "Regular Membership",
    description: "For individuals who want to be part of the MDPU community",
    features: [
      "Access to all general meetings",
      "Participation in community events",
      "Voting rights in general elections",
      "Access to member directory",
      "Newsletter and updates",
    ],
    price: "Free",
  },
  {
    title: "Supporting Membership",
    description: "For members who want to contribute financially to our mission",
    features: [
      "All Regular Membership benefits",
      "Priority access to programs",
      "Recognition in annual report",
      "Invitation to exclusive events",
      "Direct input on project priorities",
    ],
    price: "$50/year",
  },
  {
    title: "Lifetime Membership",
    description: "For committed members who want to make a lasting impact",
    features: [
      "All Supporting Membership benefits",
      "Lifetime membership status",
      "Special recognition at events",
      "Legacy project participation",
      "Board nomination eligibility",
    ],
    price: "$500 one-time",
  },
];

export default function Membership() {
  return (
    <>
      <PageHero
        title="Join MDPU"
        subtitle="Become Part of Our Family"
        description="Join the Mathamba Descendants Progressive Union and be part of a community that's building a brighter future through togetherness and unity."
      />

      {/* Membership Benefits */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Why Join MDPU?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the benefits of being part of our progressive union
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {membershipBenefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-brand-forest">
                      {benefit.icon}
                    </div>
                  </div>
                  <CardTitle className="text-brand-charcoal">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Membership Types */}
      <Section background="muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Membership Types
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the membership level that best fits your commitment and goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipTypes.map((type, index) => (
              <Card key={index} className={`h-full ${index === 1 ? 'border-brand-forest border-2' : ''}`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-brand-charcoal">{type.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {type.description}
                  </CardDescription>
                  <div className="text-2xl font-bold text-brand-forest mt-4">
                    {type.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Join Form */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Ready to Join?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fill out the form below to start your membership application. 
              Our team will review your application and get back to you within 2-3 business days.
            </p>
          </div>
          
          <JoinForm />
        </div>
      </Section>

      {/* Additional Information */}
      <Section background="brand">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
            Questions About Membership?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            We're here to help you understand the membership process and answer any questions you might have.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-charcoal">Membership Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-gray-600">
                  <li>• Be a descendant of Mathamba</li>
                  <li>• Support the organization's mission and values</li>
                  <li>• Commit to active participation in union activities</li>
                  <li>• Agree to abide by the constitution and code of conduct</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-charcoal">Application Process</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-gray-600">
                  <li>• Submit your application form</li>
                  <li>• Review by membership committee (2-3 days)</li>
                  <li>• Welcome email with member resources</li>
                  <li>• Invitation to next general meeting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
