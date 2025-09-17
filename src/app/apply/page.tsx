'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PageHero } from '@/components/ui/custom/PageHero';
import { Section } from '@/components/ui/custom/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserPlus, CheckCircle, AlertCircle, LogIn } from 'lucide-react';

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  chapter: z.string().min(1, 'Please select a chapter'),
  notes: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const chapters = [
  'Freetown, Sierra Leone',
  'London, UK',
  'New York, USA',
  'Toronto, Canada',
  'Washington DC, USA',
  'Other'
];

export default function Apply() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
  });

  // Check for existing application
  const checkExistingApplication = async () => {
    if (!user) return;
    
    const q = query(
      collection(db, 'applications'),
      where('uid', '==', user.uid),
      where('status', 'in', ['pending', 'approved'])
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setHasExistingApplication(true);
    }
  };

  // Check for existing application when user is loaded
  if (user && !loading && !hasExistingApplication && !isSubmitted) {
    checkExistingApplication();
  }

  const onSubmit = async (data: ApplicationForm) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'applications'), {
        uid: user.uid,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        chapter: data.chapter,
        notes: data.notes || '',
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const signInWithGoogle = () => {
    // This would be implemented with Google Auth
    alert('Google Sign-in would be implemented here');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-forest mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <PageHero
          title="Join MDPU"
          subtitle="Membership Application"
          description="Become part of the Mathamba Descendants Progressive Union and help us build a stronger community."
        />
        
        <Section>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In Required
                </CardTitle>
                <CardDescription>
                  You need to sign in or create an account to apply for membership.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={signInWithGoogle} 
                  className="w-full bg-brand-forest hover:bg-brand-forest/90"
                >
                  Sign in with Google
                </Button>
                <div className="text-center text-sm text-gray-600">
                  Don't have an account? One will be created for you when you sign in.
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </>
    );
  }

  if (hasExistingApplication) {
    return (
      <>
        <PageHero
          title="Application Status"
          subtitle="Membership Application"
          description="You have already submitted a membership application."
        />
        
        <Section>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                  Application Pending
                </CardTitle>
                <CardDescription>
                  Your membership application is currently under review. You will be notified once a decision has been made.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button onClick={() => router.push('/profile')} variant="outline">
                  View Profile
                </Button>
                <Button onClick={() => router.push('/')} className="bg-brand-forest hover:bg-brand-forest/90">
                  Return Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </Section>
      </>
    );
  }

  if (isSubmitted) {
    return (
      <>
        <PageHero
          title="Application Submitted"
          subtitle="Thank You"
          description="Your membership application has been successfully submitted."
        />
        
        <Section>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Application Received
                </CardTitle>
                <CardDescription>
                  We have received your membership application and it is now under review. You will receive an email notification once a decision has been made.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>What happens next?</strong><br />
                    Our membership committee will review your application within 5-7 business days. 
                    Once approved, you'll gain access to member-only features and be able to participate in all MDPU activities.
                  </p>
                </div>
                <Button onClick={() => router.push('/')} className="bg-brand-forest hover:bg-brand-forest/90">
                  Return Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Join MDPU"
        subtitle="Membership Application"
        description="Become part of the Mathamba Descendants Progressive Union and help us build a stronger community."
      />

      <Section>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Membership Application
              </CardTitle>
              <CardDescription>
                Please fill out the form below to apply for MDPU membership. All information will be kept confidential.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email address"
                    defaultValue={user.email || ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                  <p className="text-xs text-gray-600">
                    Your phone number will be kept private and used only for membership communication.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chapter">Chapter/Location *</Label>
                  <Select onValueChange={(value) => setValue('chapter', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your chapter or location" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter} value={chapter}>
                          {chapter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.chapter && (
                    <p className="text-sm text-red-600">{errors.chapter.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    {...register('notes')}
                    placeholder="Any additional information you'd like to share..."
                    rows={4}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Privacy Notice</h4>
                  <p className="text-sm text-blue-800">
                    Your personal information (phone and email) will be kept strictly confidential and used only for 
                    membership administration. Public member profiles contain only your name, chapter, and optional role information.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-forest hover:bg-brand-forest/90"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
