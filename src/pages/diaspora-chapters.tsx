"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, Calendar, Mail, Phone, Send, CheckCircle, Globe } from "lucide-react";
import "./diaspora-chapters.css";

const startChapterFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  city: z.string().min(2, "Please enter your city"),
  country: z.string().min(2, "Please enter your country"),
  memberCount: z.string().min(1, "Please select estimated member count"),
  motivation: z.string().min(10, "Please explain your motivation (at least 10 characters)"),
});

type StartChapterFormData = z.infer<typeof startChapterFormSchema>;

const chapters = [
  {
    name: "Freetown Chapter",
    location: "Freetown, Sierra Leone",
    established: "2020",
    members: 150,
    president: "Dr. Aminata Kamara",
    email: "freetown@mdpu.org",
    phone: "+232 123 456 789",
    description: "Our flagship chapter and headquarters, serving the Freetown community with various programs and initiatives.",
    activities: ["Monthly meetings", "Educational programs", "Community service", "Cultural events"],
  },
  {
    name: "London Chapter",
    location: "London, United Kingdom",
    established: "2021",
    members: 85,
    president: "Sarah Williams",
    email: "london@mdpu.org",
    phone: "+44 20 1234 5678",
    description: "Our largest international chapter, connecting Mathamba descendants across the UK and Europe.",
    activities: ["Monthly meetings", "Networking events", "Cultural celebrations", "Youth programs"],
  },
  {
    name: "New York Chapter",
    location: "New York, USA",
    established: "2022",
    members: 65,
    president: "David Thompson",
    email: "newyork@mdpu.org",
    phone: "+1 212 123 4567",
    description: "Serving the East Coast diaspora community with regular meetings and community engagement activities.",
    activities: ["Monthly meetings", "Professional networking", "Community outreach", "Educational workshops"],
  },
  {
    name: "Toronto Chapter",
    location: "Toronto, Canada",
    established: "2022",
    members: 45,
    president: "Aisha Johnson",
    email: "toronto@mdpu.org",
    phone: "+1 416 123 4567",
    description: "Growing chapter focused on youth engagement and educational programs in the Canadian diaspora.",
    activities: ["Monthly meetings", "Youth programs", "Educational initiatives", "Cultural events"],
  },
  {
    name: "Atlanta Chapter",
    location: "Atlanta, USA",
    established: "2023",
    members: 35,
    president: "Mariama Koroma",
    email: "atlanta@mdpu.org",
    phone: "+1 404 123 4567",
    description: "Newly established chapter building connections in the Southeast United States.",
    activities: ["Monthly meetings", "Community building", "Cultural events", "Professional development"],
  },
  {
    name: "Washington DC Chapter",
    location: "Washington DC, USA",
    established: "2023",
    members: 30,
    president: "Dr. Mohamed Jalloh",
    email: "washington@mdpu.org",
    phone: "+1 202 123 4567",
    description: "Professional chapter focused on policy engagement and community advocacy.",
    activities: ["Monthly meetings", "Policy discussions", "Professional networking", "Community advocacy"],
  },
];

const memberCountOptions = [
  "5-10 members",
  "11-20 members",
  "21-50 members",
  "51-100 members",
  "100+ members",
];

export default function DiasporaChapters() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<StartChapterFormData>({
    resolver: zodResolver(startChapterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      memberCount: "",
      motivation: "",
    },
  });

  const onSubmit = async (data: StartChapterFormData) => {
    try {
      // Here you would typically send the data to your API
      console.log("Start chapter form submitted:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="diaspora-chapters">
        <PageHero
          title="Thank You!"
          subtitle="Application Received"
          description="We've received your application to start a new chapter. Our team will review it and get back to you within 5-7 business days."
        />
        
        <Section>
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-brand-charcoal mb-4">
              Your Chapter Application Has Been Submitted
            </h2>
            <p className="text-gray-600 mb-8">
              Thank you for your interest in starting a new MDPU chapter. We'll review your application and 
              contact you with next steps. In the meantime, feel free to reach out to our existing chapters 
              to learn more about our activities.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
            >
              Submit Another Application
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="diaspora-chapters">
      <PageHero
        title="Our Chapters"
        subtitle="Global Community"
        description="Connect with Mathamba descendants worldwide through our network of chapters. Find your local community or start a new chapter in your area."
      />

      {/* Existing Chapters */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Our Global Network
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with Mathamba descendants in your area through our established chapters
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chapters.map((chapter, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-brand-charcoal">{chapter.name}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        {chapter.location}
                      </CardDescription>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>Est. {chapter.established}</div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {chapter.members} members
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    {chapter.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-2">Chapter President</h4>
                    <p className="text-sm text-gray-600">{chapter.president}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-600" />
                      <a href={`mailto:${chapter.email}`} className="hover:text-brand-forest transition-colors">
                        {chapter.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-600" />
                      <a href={`tel:${chapter.phone}`} className="hover:text-brand-forest transition-colors">
                        {chapter.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-brand-charcoal mb-2">Activities</h4>
                    <div className="flex flex-wrap gap-1">
                      {chapter.activities.map((activity, activityIndex) => (
                        <span key={activityIndex} className="text-xs bg-brand-sand text-brand-charcoal px-2 py-1 rounded">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Start a Chapter */}
      <Section background="muted">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Start a New Chapter
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don&apos;t see a chapter in your area? Start one! We provide support and guidance to help you establish a new MDPU chapter in your community.
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-brand-charcoal">
                Chapter Application
              </CardTitle>
              <CardDescription>
                Tell us about your community and your vision for a new MDPU chapter
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="memberCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Member Count *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select estimated count" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {memberCountOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="motivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why do you want to start a chapter? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your motivation and vision for the new chapter..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-forest hover:bg-brand-forest/90"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Chapter Benefits */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Benefits of Starting a Chapter
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the advantages of establishing a local MDPU chapter in your community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-brand-forest" />
                </div>
                <CardTitle className="text-brand-charcoal">Community Building</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Connect with local Mathamba descendants and build lasting relationships
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-clay/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-brand-clay" />
                </div>
                <CardTitle className="text-brand-charcoal">Regular Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Organize meetings, events, and activities that serve your local community
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-brand-gold" />
                </div>
                <CardTitle className="text-brand-charcoal">Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Access to our worldwide network of chapters and resources
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-brand-forest" />
                </div>
                <CardTitle className="text-brand-charcoal">Local Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Make a positive impact in your local community through organized initiatives
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
