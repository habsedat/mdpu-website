'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHero } from '@/components/ui/custom/PageHero';
import { Section } from '@/components/ui/custom/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { httpsCallable } from 'firebase/functions';
import { functions, refreshUserToken } from '@/lib/firebase';
import { Shield, AlertCircle } from 'lucide-react';

export default function BootstrapPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('habmfk@gmail.com');
  const [initKey, setInitKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !initKey) {
      setMessage('❌ Email and initialization key are required');
      return;
    }

    setIsSubmitting(true);
    setMessage('🔄 Creating superadmin...');

    try {
      const assignRoleFunction = httpsCallable(functions, 'assignRole');
      
      const result = await assignRoleFunction({
        email,
        role: 'superadmin',
        initKey,
      });

      setMessage('✅ Superadmin created successfully! Redirecting...');

      // Force token refresh
      await refreshUserToken();

      // Redirect to admin
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (error: any) {
      console.error('Bootstrap error:', error);
      
      let errorMessage = '❌ Failed to create superadmin: ';
      
      if (error.message?.includes('Firestore API')) {
        errorMessage += 'Please enable Firestore API first';
      } else if (error.message?.includes('user not found')) {
        errorMessage += 'User account must exist in Firebase Auth first';
      } else if (error.message?.includes('permission')) {
        errorMessage += 'Invalid initialization key';
      } else {
        errorMessage += error.message || 'Unknown error';
      }

      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        title="Bootstrap Admin System"
        subtitle="One-Time Setup"
        description="Initialize the first superadmin account for MDPU administration."
      />

      <Section>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-forest" />
                Create First Superadmin
              </CardTitle>
              <CardDescription>
                This is a one-time setup to create the initial superadmin account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Important</span>
                </div>
                <p className="text-blue-700 text-sm">
                  The user account must already exist in Firebase Auth before you can grant admin privileges.
                </p>
              </div>

              {message && (
                <div className="mb-4 p-3 bg-gray-50 border rounded-lg">
                  <p className="text-sm">{message}</p>
                </div>
              )}

              <form onSubmit={handleBootstrap} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="habmfk@gmail.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initKey">Initialization Key</Label>
                  <Input
                    id="initKey"
                    type="password"
                    value={initKey}
                    onChange={(e) => setInitKey(e.target.value)}
                    placeholder="mdpu-admin-init-2024"
                    required
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• User account must exist in Firebase Auth</li>
                    <li>• Initialization key: mdpu-admin-init-2024</li>
                    <li>• Enable Firestore API first</li>
                    <li>• Only one bootstrap operation allowed</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-brand-forest hover:bg-brand-forest/90 text-white"
                >
                  {isSubmitting ? 'Creating Superadmin...' : 'Bootstrap Superadmin'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Need help? Check the{' '}
                  <a href="/README_admin.md" className="text-brand-forest underline">
                    admin documentation
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}