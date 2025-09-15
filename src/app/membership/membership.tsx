import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { JoinForm } from "@/components/ui/custom/JoinForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Target, Award, CheckCircle } from "lucide-react";
import "./join-membership.css";

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

      {/* Registration Information */}
      <Section background="muted">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Register to Become a Member of MDPU
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Before continuing with the registration, please read the information carefully.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-brand-primary border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-brand-charcoal">Registration</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Join the MDPU community and become part of our progressive union
                </CardDescription>
                <div className="text-4xl font-bold text-brand-primary mt-6">
                  $25
                </div>
                <p className="text-sm text-gray-500 mt-2">One-time registration fee</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-brand-charcoal text-lg">What's Included:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Access to all general meetings</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Participation in community events</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Voting rights in general elections</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Access to member directory</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Newsletter and updates</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Priority access to programs</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Recognition in annual report</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Invitation to exclusive events</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Direct input on project priorities</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <li>• Be a descendant of Mathamba or his/her two immediate parents (mother and father)</li>
                  <li>• Or be from his great families (grandmother and grandfather)</li>
                  <li>• Or have relation origin from the village</li>
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
                  <li>• Registration fee is $25</li>
                  <li>• Welcome email with member resources</li>
                  <li>• Invitation to next general meeting</li>
                </ul>
              </CardContent>
            </Card>
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
              Registration fee is $25.
            </p>
          </div>

          <JoinForm />
        </div>
      </Section>
    </>
  );
}
