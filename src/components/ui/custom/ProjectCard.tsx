import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  status: "active" | "completed" | "planned";
  location?: string;
  startDate?: string;
  endDate?: string;
  participants?: number;
  slug: string;
  className?: string;
}

export function ProjectCard({
  title,
  description,
  image,
  status,
  location,
  startDate,
  endDate,
  participants,
  slug,
  className,
}: ProjectCardProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    planned: "bg-yellow-100 text-yellow-800",
  };

  return (
    <Card className={`h-full hover:shadow-lg transition-shadow duration-200 ${className || ""}`}>
      {image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold text-brand-charcoal">
            {title}
          </CardTitle>
          <Badge className={statusColors[status]}>
            {status}
          </Badge>
        </div>
        
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-gray-600">
          {location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {location}
            </div>
          )}
          
          {startDate && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {startDate} {endDate && `- ${endDate}`}
            </div>
          )}
          
          {participants && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {participants} participants
            </div>
          )}
        </div>
        
        <Button asChild className="w-full bg-brand-forest hover:bg-brand-forest/90">
          <Link href={`/projects/${slug}`}>
            Learn More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

