'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export function DynamicEvents() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadEvents();
    
    // Update current time every minute for accurate countdown
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const loadEvents = async () => {
    try {
      console.log('Loading public events...');
      
      // Simplified query to avoid indexing issues - load all events first
      const eventsQuery = query(
        collection(db, 'events'),
        orderBy('dateStart', 'asc')
      );
      
      const eventsSnapshot = await getDocs(eventsQuery);
      const allEventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      
      console.log('All events loaded:', allEventsData.length);
      
      // Filter for public events only (client-side)
      const publicEvents = allEventsData.filter(event => event.isPublic);
      
      console.log('All public events loaded:', publicEvents.length, publicEvents);
      setAllEvents(publicEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      
      // Fallback: Try loading without ordering
      try {
        console.log('Trying fallback query without ordering...');
        const fallbackQuery = query(collection(db, 'events'));
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const fallbackData = fallbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        
        // Filter for public events
        const publicEvents = fallbackData.filter(event => event.isPublic);
        console.log('Fallback public events:', publicEvents.length, publicEvents);
        setAllEvents(publicEvents);
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Smart event categorization
  const categorizeEvents = () => {
    const now = currentTime;
    const upcoming: Event[] = [];
    const active: Event[] = [];
    const past: Event[] = [];

    allEvents.forEach(event => {
      const eventStart = event.dateStart.toDate();
      const eventEnd = event.dateEnd ? event.dateEnd.toDate() : eventStart;
      
      // Add end time to event end date
      if (event.timeEnd) {
        const [hours, minutes] = event.timeEnd.split(':');
        eventEnd.setHours(parseInt(hours), parseInt(minutes));
      } else {
        // If no end time, assume event lasts 2 hours
        eventEnd.setTime(eventEnd.getTime() + (2 * 60 * 60 * 1000));
      }

      if (now < eventStart) {
        upcoming.push(event);
      } else if (now >= eventStart && now <= eventEnd) {
        active.push(event);
      } else {
        past.push(event);
      }
    });

    return { upcoming, active, past };
  };

  // Countdown timer function
  const getCountdown = (eventDate: Date) => {
    const now = currentTime;
    const timeDiff = eventDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return null;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const formatEventDate = (timestamp: any) => {
    if (!timestamp) return 'Date TBA';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatEventTime = (timeStart: string, timeEnd?: string) => {
    if (!timeStart) return 'Time TBA';
    
    // Convert 24-hour to 12-hour format
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour12 = parseInt(hours) % 12 || 12;
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    };
    
    if (timeEnd && timeEnd !== timeStart) {
      return `${formatTime(timeStart)} - ${formatTime(timeEnd)}`;
    }
    return formatTime(timeStart);
  };

  const { upcoming, active, past } = categorizeEvents();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (allEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Available</h3>
        <p className="text-gray-500 mb-6">
          Check back soon for exciting MDPU events and activities.
        </p>
        <Button asChild>
          <Link href="/contact">
            <Mail className="w-4 h-4 mr-2" />
            Contact Us for Event Information
          </Link>
        </Button>
      </div>
    );
  }

  const renderEventCard = (event: Event, isActive = false, countdown?: string | null) => (
    <Card key={event.id} className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${isActive ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}>
          {/* Event Thumbnail */}
          {event.thumbnailUrl && (
            <div className="relative bg-gray-100">
              <img 
                src={event.thumbnailUrl} 
                alt={event.title}
                className="w-full h-auto object-contain"
                style={{ minHeight: '200px', maxHeight: '300px' }}
              />
              {event.category && (
                <div className="absolute top-3 left-3">
                  <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {event.category}
                  </span>
                </div>
              )}
            </div>
          )}
          
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
              {event.title}
            </CardTitle>
            <CardDescription className="text-gray-600 line-clamp-3">
              {event.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Date and Time */}
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              <span>{formatEventDate(event.dateStart)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-green-600" />
              <span>{formatEventTime(event.timeStart, event.timeEnd)}</span>
            </div>
            
            {/* Location */}
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-red-600" />
              <span className="line-clamp-2">{event.location}</span>
            </div>
            
            {/* Attendee Info */}
            {event.maxAttendees && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-purple-600" />
                <span>Limited to {event.maxAttendees.toLocaleString()} attendees</span>
              </div>
            )}
            
            {/* Registration Required */}
            {event.registrationRequired && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-800 font-medium">
                  🎫 Registration Required
                </p>
                {event.contactEmail && (
                  <p className="text-xs text-orange-600 mt-1">
                    Contact: {event.contactEmail}
                  </p>
                )}
              </div>
            )}
            
            {/* Contact Information */}
            {event.contactEmail && !event.registrationRequired && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  📧 More info: {event.contactEmail}
                </p>
              </div>
            )}
            
            {/* Countdown Timer */}
            {countdown && (
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-3 mt-4">
                <p className="text-sm font-medium text-center">
                  ⏰ Starts in: {countdown}
                </p>
              </div>
            )}

            {/* Active Event Indicator */}
            {isActive && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-3 mt-4">
                <p className="text-sm font-medium text-center">
                  🔴 LIVE EVENT - Happening Now!
                </p>
              </div>
            )}
            
            {/* Event Details Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => setSelectedEvent(event)}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              View Full Details
            </Button>
          </CardContent>
        </Card>
  );

  return (
    <div className="space-y-12">
      {/* Active Events */}
      {active.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
            🔴 Live Events - Happening Now!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {active.map((event) => renderEventCard(event, true))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
            📅 Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcoming.map((event) => {
              const eventStart = event.dateStart.toDate();
              const countdown = getCountdown(eventStart);
              return renderEventCard(event, false, countdown);
            })}
          </div>
        </div>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-600 mb-6 flex items-center gap-2">
            📚 Past Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {past.slice(0, 6).map((event) => renderEventCard(event))}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  ✕
                </Button>
              </div>

              {/* Event Thumbnail */}
              {selectedEvent.thumbnailUrl && (
                <div className="mb-6">
                  <img 
                    src={selectedEvent.thumbnailUrl} 
                    alt={selectedEvent.title}
                    className="w-full h-auto object-contain rounded-lg"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                    <span>{formatEventDate(selectedEvent.dateStart)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-green-600" />
                    <span>{formatEventTime(selectedEvent.timeStart, selectedEvent.timeEnd)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 md:col-span-2">
                    <MapPin className="w-5 h-5 mr-3 text-red-600" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  
                  {selectedEvent.maxAttendees && (
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-3 text-purple-600" />
                      <span>Limited to {selectedEvent.maxAttendees.toLocaleString()} attendees</span>
                    </div>
                  )}
                  
                  {selectedEvent.contactEmail && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3 text-indigo-600" />
                      <span>{selectedEvent.contactEmail}</span>
                    </div>
                  )}
                </div>

                {/* Event Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">About This Event</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                </div>

                {/* Detailed Information */}
                {selectedEvent.details && selectedEvent.details !== selectedEvent.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Event Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {selectedEvent.details}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Registration Info */}
                {selectedEvent.registrationRequired && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 mb-2">🎫 Registration Required</h3>
                    <p className="text-orange-700">
                      Please contact {selectedEvent.contactEmail || 'the event organizer'} to register for this event.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
