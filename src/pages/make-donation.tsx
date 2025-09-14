import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Target, Users, Award, CreditCard, Repeat, Gift, Shield } from "lucide-react";
import "./make-donation.css";

export const metadata = {
  title: "Donate - Support MDPU",
  description: "Support the Mathamba Descendants Progressive Union and help us build stronger communities through your generous contributions.",
};

const donationOptions = [
  {
    title: "One-Time Donation",
    description: "Make a single contribution to support our ongoing projects and initiatives",
    icon: <Gift className="w-6 h-6" />,
    amounts: [25, 50, 100, 250, 500],
    features: [
      "Support specific projects",
      "Tax-deductible receipt",
      "Impact report",
      "Recognition in annual report",
    ],
  },
  {
    title: "Monthly Recurring",
    description: "Provide sustained support with automatic monthly contributions",
    icon: <Repeat className="w-6 h-6" />,
    amounts: [10, 25, 50, 100],
    features: [
      "Sustained impact",
      "Automatic processing",
      "Cancel anytime",
      "Member benefits",
    ],
  },
  {
    title: "Project-Specific",
    description: "Direct your donation to a specific project or initiative",
    icon: <Target className="w-6 h-6" />,
    amounts: [50, 100, 250, 500, 1000],
    features: [
      "Choose your impact",
      "Project updates",
      "Direct feedback",
      "Special recognition",
    ],
  },
];

const impactAreas = [
  {
    title: "Education & Youth Development",
    description: "Support scholarships, school supplies, and youth programs",
    icon: <Users className="w-6 h-6" />,
    impact: "Help 50+ students annually",
  },
  {
    title: "Community Infrastructure",
    description: "Fund community centers, clean water projects, and facilities",
    icon: <Target className="w-6 h-6" />,
    impact: "Serve 500+ community members",
  },
  {
    title: "Healthcare Access",
    description: "Support mobile clinics and health education programs",
    icon: <Heart className="w-6 h-6" />,
    impact: "Provide care to 200+ families",
  },
  {
    title: "Economic Development",
    description: "Fund micro-loans and business development programs",
    icon: <Award className="w-6 h-6" />,
    impact: "Create 25+ new businesses",
  },
];

const currentProjects = [
  {
    title: "Community Education Initiative",
    goal: 25000,
    raised: 18500,
    description: "Providing educational resources and support to underserved communities",
  },
  {
    title: "Youth Development Program",
    goal: 15000,
    raised: 12000,
    description: "Empowering young people through skills training and mentorship",
  },
  {
    title: "Healthcare Access Project",
    goal: 30000,
    raised: 8500,
    description: "Improving healthcare access in rural communities",
  },
];

export default function MakeDonation() {
  return (
    <div className="make-donation">
      <PageHero
        title="Support Our Mission"
        subtitle="Make a Difference"
        description="Your generous contribution helps us build stronger communities, support education, and create opportunities for Mathamba descendants worldwide."
      />

      {/* Impact Areas */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Where Your Donation Goes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every contribution makes a real difference in our communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactAreas.map((area, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-brand-forest">
                      {area.icon}
                    </div>
                  </div>
                  <CardTitle className="text-brand-charcoal">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {area.description}
                  </CardDescription>
                  <div className="text-sm font-semibold text-brand-forest">
                    {area.impact}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Current Projects */}
      <Section background="muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Current Fundraising Campaigns
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Support our active projects and help us reach our goals
            </p>
          </div>
          
          <div className="space-y-8">
            {currentProjects.map((project, index) => {
              const percentage = (project.raised / project.goal) * 100;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-brand-charcoal">{project.title}</CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                          {project.description}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-brand-forest">
                          ${project.raised.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          of ${project.goal.toLocaleString()} goal
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-brand-forest h-3 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {percentage.toFixed(1)}% funded
                        </span>
                        <Button size="sm" className="bg-brand-forest hover:bg-brand-forest/90">
                          Donate to This Project
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Donation Options */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Choose Your Donation Type
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the donation option that works best for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {donationOptions.map((option, index) => (
              <Card key={index} className={`h-full ${index === 1 ? 'border-brand-forest border-2' : ''}`}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-brand-forest">
                      {option.icon}
                    </div>
                  </div>
                  <CardTitle className="text-brand-charcoal">{option.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-2">
                    {option.amounts.map((amount) => (
                      <Button 
                        key={amount} 
                        variant="outline" 
                        size="sm"
                        className="border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    {option.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-brand-forest rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-brand-forest hover:bg-brand-forest/90">
                    {index === 1 ? "Start Monthly Giving" : "Donate Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Security & Trust */}
      <Section background="brand">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
            Secure & Trusted Donations
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Your donation is secure and will be used responsibly to support our mission
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Secure Processing</h3>
              <p className="text-gray-600 text-sm">
                All donations are processed securely using industry-standard encryption
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Multiple Payment Methods</h3>
              <p className="text-gray-600 text-sm">
                Accept credit cards, bank transfers, and other secure payment options
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">Tax Deductible</h3>
              <p className="text-gray-600 text-sm">
                Receive a tax-deductible receipt for your generous contribution
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Every donation, no matter the size, helps us build stronger communities and create opportunities for Mathamba descendants worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-charcoal">
              <Heart className="w-5 h-5 mr-2" />
              Donate Now
            </Button>
            <Button size="lg" variant="outline" className="border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white">
              <Repeat className="w-5 h-5 mr-2" />
              Set Up Recurring Donation
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
