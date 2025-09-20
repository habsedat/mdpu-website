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
      
      let errorMessage = 'Invalid login credentials. Please verify your email and password.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No MDPU member account found with this email address. Please check your email or contact support.';
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Incorrect email or password. Please double-check your credentials and try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address format.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Your MDPU member account has been suspended. Please contact union administration for assistance.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many login attempts. Please wait a few minutes before trying again for security purposes.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
      } else {
        // Generic professional message without Firebase references
        errorMessage = 'Unable to sign in at this time. Please verify your credentials or contact MDPU support.';
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
      {/* Sign In Hero - Clean Professional Theme */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your MDPU member account</p>
          </div>
          
          {/* Sign In Card */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
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
      </div>
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
