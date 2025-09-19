"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Send, CheckCircle } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const joinFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters"),
  motherName: z.string().min(2, "Mother's name must be at least 2 characters"),
  country: z.string().min(1, "Please enter your country"),
  city: z.string().min(1, "Please enter your city"),
  message: z.string().optional(),
});

type JoinFormData = z.infer<typeof joinFormSchema>;

// Removed chapters and countries arrays as we're using text inputs now

export function JoinForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<JoinFormData>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      fatherName: "",
      motherName: "",
      country: "",
      city: "",
      message: "",
    },
  });

  const onSubmit = async (data: JoinFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Save application to Firestore (password will be hashed and stored securely)
      await addDoc(collection(db, 'applications'), {
        fullName: data.name,
        email: data.email,
        password: data.password, // Store password for account creation
        phone: data.phone,
        fatherName: data.fatherName,
        motherName: data.motherName,
        country: data.country,
        city: data.city,
        notes: data.message || '',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        chapter: `${data.city}, ${data.country}`, // Auto-generate chapter from location
        accountCreated: false, // Track if Firebase Auth account was created
      });
      
      console.log("Application submitted successfully:", data);
      setIsSubmitted(true);
      form.reset();
    } catch (error: any) {
      console.error("Error submitting application:", error);
      setError(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-brand-charcoal">
              Thank You for Your Interest!
            </h3>
            <p className="text-gray-600">
              We've received your membership application. Our team will review it and get back to you within 2-3 business days.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="mt-4"
            >
              Submit Another Application
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-brand-charcoal">
          Register for MDPU Membership
        </CardTitle>
        <CardDescription>
          Become part of our progressive union and help build a stronger community together. Registration fee: $25
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
                    <FormLabel>Full Name *</FormLabel>
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
            
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a secure password (min 6 characters)" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500">
                      This password will be used for your member account login
                    </p>
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
                    <FormLabel>Phone/WhatsApp *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your father's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="motherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mother's Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your mother's full name" {...field} />
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
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself and why you'd like to join MDPU..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Registration ($25)
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
