import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "general" | "executive" | "special";
  attendees?: number;
  slug: string;
  className?: string;
}

export function EventCard({
  title,
  description,
  date,
  time,
  location,
  type,
  attendees,
  slug,
  className,
}: EventCardProps) {
  const typeColors = {
    general: "bg-brand-forest text-white",
    executive: "bg-brand-clay text-white",
    special: "bg-brand-gold text-brand-charcoal",
  };

  const typeLabels = {
    general: "General Meeting",
    executive: "Executive Meeting",
    special: "Special Event",
  };

  return (
    <Card className={`h-full hover:shadow-lg transition-shadow duration-200 ${className || ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold text-brand-charcoal">
            {title}
          </CardTitle>
          <Badge className={typeColors[type]}>
            {typeLabels[type]}
          </Badge>
        </div>
        
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {date}
          </div>
          
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {time}
          </div>
          
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {location}
          </div>
          
          {attendees && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {attendees} attendees
            </div>
          )}
        </div>
        
        <Button asChild className="w-full bg-brand-forest hover:bg-brand-forest/90">
          <Link href={`/events/${slug}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
