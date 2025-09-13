import { PageHero } from "@/components/ui/custom/PageHero";
import { Section } from "@/components/ui/custom/Section";
import { EventCard } from "@/components/ui/custom/EventCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Events - MDPU",
  description: "Join us for our regular meetings and special events. Stay connected with the Mathamba Descendants Progressive Union community.",
};

// Sample events data - in a real app, this would come from a CMS or API
const upcomingEvents = [
  {
    title: "Monthly General Meeting",
    description: "Join us for our monthly general meeting to discuss union activities, upcoming projects, and community updates.",
    date: "Sunday, February 4, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "19n Thompson Bay, off Wilkinson Road, Freetown",
    type: "general" as const,
    attendees: 45,
    slug: "february-2024-general-meeting",
  },
  {
    title: "Executive Committee Meeting",
    description: "Strategic planning session for the executive committee to review progress and plan upcoming initiatives.",
    date: "Saturday, February 10, 2024",
    time: "10:00 AM - 12:00 PM",
    location: "Virtual Meeting (Zoom)",
    type: "executive" as const,
    attendees: 12,
    slug: "february-2024-executive-meeting",
  },
  {
    title: "Youth Development Workshop",
    description: "A special workshop focused on skills development and career guidance for young members.",
    date: "Saturday, February 17, 2024",
    time: "9:00 AM - 3:00 PM",
    location: "Community Center, Freetown",
    type: "special" as const,
    attendees: 30,
    slug: "youth-development-workshop-february",
  },
  {
    title: "Cultural Heritage Celebration",
    description: "Join us for an evening celebrating our rich cultural heritage with traditional music, dance, and food.",
    date: "Saturday, February 24, 2024",
    time: "6:00 PM - 10:00 PM",
    location: "Freetown Cultural Center",
    type: "special" as const,
    attendees: 100,
    slug: "cultural-heritage-celebration-february",
  },
];

const pastEvents = [
  {
    title: "January General Meeting",
    description: "Monthly general meeting with updates on community projects and new member introductions.",
    date: "Sunday, January 7, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "19n Thompson Bay, off Wilkinson Road, Freetown",
    type: "general" as const,
    attendees: 42,
    slug: "january-2024-general-meeting",
  },
  {
    title: "New Year Community Service",
    description: "Annual community service day where members volunteered at local schools and community centers.",
    date: "Saturday, January 13, 2024",
    time: "8:00 AM - 2:00 PM",
    location: "Various locations in Freetown",
    type: "special" as const,
    attendees: 35,
    slug: "new-year-community-service-2024",
  },
];

const meetingSchedule = {
  general: {
    frequency: "First Sunday of each month",
    time: "2:00 PM - 4:00 PM",
    location: "19n Thompson Bay, off Wilkinson Road, Freetown",
    description: "Open to all members. Virtual attendance available.",
  },
  executive: {
    frequency: "Bi-weekly",
    time: "Varies",
    location: "Virtual and in-person",
    description: "For executive committee and board members.",
  },
};

export default function Events() {
  return (
    <>
      <PageHero
        title="Events & Meetings"
        subtitle="Stay Connected"
        description="Join us for our regular meetings and special events. Stay connected with the MDPU community and participate in our activities."
      />

      {/* Meeting Schedule */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Regular Meeting Schedule
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our regular meetings provide opportunities for members to connect, share ideas, and participate in decision-making.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-brand-forest">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-charcoal">
                  <Calendar className="w-6 h-6 mr-3 text-brand-forest" />
                  General Meetings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-600" />
                    {meetingSchedule.general.frequency}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-600" />
                    {meetingSchedule.general.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                    {meetingSchedule.general.location}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {meetingSchedule.general.description}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-brand-clay">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-charcoal">
                  <Users className="w-6 h-6 mr-3 text-brand-clay" />
                  Executive Meetings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-600" />
                    {meetingSchedule.executive.frequency}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-600" />
                    {meetingSchedule.executive.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                    {meetingSchedule.executive.location}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {meetingSchedule.executive.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Upcoming Events */}
      <Section background="muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Upcoming Events
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join us for these upcoming meetings and special events
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.slug} {...event} />
            ))}
          </div>
        </div>
      </Section>

      {/* Past Events */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Recent Events
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A look back at our recent meetings and activities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pastEvents.map((event) => (
              <EventCard key={event.slug} {...event} />
            ))}
          </div>
        </div>
      </Section>

      {/* Event Guidelines */}
      <Section background="brand">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-charcoal mb-4">
              Event Guidelines
            </h2>
            <p className="text-gray-600">
              Please review our event guidelines to ensure a positive experience for everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-charcoal">For In-Person Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Arrive 10-15 minutes early</li>
                  <li>• Bring a valid ID for registration</li>
                  <li>• Follow dress code guidelines</li>
                  <li>• Respect the meeting space and other attendees</li>
                  <li>• Participate actively and respectfully</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-charcoal">For Virtual Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Test your connection before the event</li>
                  <li>• Use a quiet, well-lit space</li>
                  <li>• Mute your microphone when not speaking</li>
                  <li>• Use the chat feature appropriately</li>
                  <li>• Be respectful of others' time and attention</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-charcoal mb-6">
            Want to Stay Updated?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join our mailing list to receive updates about upcoming events, meetings, and special announcements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-brand-forest hover:bg-brand-forest/90">
              <Link href="/membership">
                <Users className="w-5 h-5 mr-2" />
                Become a Member
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white">
              <Link href="/contact">
                <ArrowRight className="w-5 h-5 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
