import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin } from "lucide-react";

interface LeadershipRoleCardProps {
  name: string;
  position: string;
  image?: string;
  email?: string;
  phone?: string;
  location?: string;
  term?: string;
  bio?: string;
  className?: string;
}

export function LeadershipRoleCard({
  name,
  position,
  image,
  email,
  phone,
  location,
  term,
  bio,
  className,
}: LeadershipRoleCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className={`h-full ${className || ""}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="w-24 h-24 border-4 border-brand-gold/20 shadow-lg">
            <AvatarImage src={image} alt={name} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <CardTitle className="text-xl font-bold text-brand-charcoal">
          {name}
        </CardTitle>
        
        <CardDescription className="text-brand-forest font-semibold">
          {position}
        </CardDescription>
        
        {term && (
          <Badge variant="outline" className="w-fit mx-auto">
            Term: {term}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {bio && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {bio}
          </p>
        )}
        
        <div className="space-y-2 text-sm">
          {email && (
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <a href={`mailto:${email}`} className="hover:text-brand-forest transition-colors">
                {email}
              </a>
            </div>
          )}
          
          {phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              <a href={`tel:${phone}`} className="hover:text-brand-forest transition-colors">
                {phone}
              </a>
            </div>
          )}
          
          {location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {location}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

