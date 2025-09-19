'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PageHero } from '@/components/ui/custom/PageHero';
import { Section } from '@/components/ui/custom/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

function SignInContent() {
  const { signIn, loading, user, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect already authenticated users
  useEffect(() => {
    if (!loading && user) {
      // User is already signed in, redirect them and replace history
      if (redirect) {
        router.replace(redirect);
      } else {
        router.replace('/profile/dashboard');
      }
    }
  }, [user, loading, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      
      // Wait a moment for auth state to update
      setTimeout(() => {
        if (redirect) {
          router.replace(redirect);
        } else {
          // Route based on role - check after sign in
          router.replace('/profile/dashboard'); // Default to member dashboard
        }
      }, 1000);
    } catch (error: any) {
      console.error('Sign-in error:', error);
      
      let errorMessage = 'Sign-in failed. Please check your credentials.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Contact an administrator.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <>
      <PageHero
        title="Members Sign In"
        subtitle="MDPU Member Portal"
        description="Access your member dashboard and admin functions"
      />

      <Section>
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-brand-forest rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-brand-charcoal">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Sign in to access your MDPU member account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 text-xl rounded-lg shadow-xl border-2 border-green-500"
                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Members Only</span>
                </div>
                <p className="text-blue-700 text-sm">
                  This portal is for approved MDPU members only. If you're not yet a member, please{' '}
                  <Link href="/membership" className="font-medium underline hover:no-underline">
                    apply for membership
                  </Link>
                  {' '}first.
                </p>
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                Need help? Contact us at{' '}
                <Link href="/contact" className="text-brand-forest hover:underline">
                  support@mdpu.org
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-forest mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
