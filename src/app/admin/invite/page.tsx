'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHero } from '@/components/ui/custom/PageHero';
import { Section } from '@/components/ui/custom/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, refreshUserToken } from '@/lib/firebase';
import { AdminInvite } from '@/types/firestore';
import { 
  Shield, 
  Clock, 
  Users, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Mail
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';

function InviteClaimContent() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const inviteId = searchParams?.get('id');

  const [invite, setInvite] = useState<AdminInvite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Callable function
  const claimAdminInviteFunction = httpsCallable(functions, 'claimAdminInvite');

  useEffect(() => {
    if (inviteId) {
      loadInvite();
    } else {
      setError('No invite ID provided');
      setIsLoading(false);
    }
  }, [inviteId]);

  const loadInvite = async () => {
    if (!inviteId) return;
    
    try {
      const inviteDoc = await getDoc(doc(db, 'adminInvites', inviteId));
      
      if (!inviteDoc.exists()) {
        setError('Invite not found');
        return;
      }

      const inviteData = {
        id: inviteDoc.id,
        ...inviteDoc.data()
      } as AdminInvite;

      setInvite(inviteData);
    } catch (error) {
      console.error('Error loading invite:', error);
      setError('Failed to load invite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimInvite = async () => {
    if (!user || !invite || !inviteId) return;

    setIsClaiming(true);
    try {
      await claimAdminInviteFunction({ inviteId });

      toast({
        title: "Success!",
        description: "Admin invite claimed successfully. Redirecting to admin dashboard...",
      });

      // Force token refresh and redirect
      await refreshUserToken();
      
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (error: any) {
      console.error('Error claiming invite:', error);
      
      let errorMessage = 'Failed to claim invite';
      
      if (error.code === 'permission-denied') {
        errorMessage = "You don't have permission to claim this invite";
      } else if (error.code === 'failed-precondition') {
        if (error.message.includes('already used')) {
          errorMessage = 'This invite has already been used';
        } else if (error.message.includes('expired')) {
          errorMessage = 'This invite has expired (1-hour limit)';
        } else if (error.message.includes('approvals')) {
          errorMessage = 'This invite needs more approvals before it can be claimed';
        } else if (error.message.includes('email')) {
          errorMessage = 'This invite is for a different email address';
        } else {
          errorMessage = error.message;
        }
      } else if (error.code === 'not-found') {
        errorMessage = 'Invite not found or has been removed';
      } else if (error.code === 'deadline-exceeded') {
        errorMessage = 'Request timed out. Please try again';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Cannot Claim Invite",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (expiresAt: any) => {
    if (!expiresAt) return 'No expiry';
    const expiry = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const isExpired = (expiresAt: any) => {
    if (!expiresAt) return false;
    const expiry = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
    return expiry < new Date();
  };

  const canClaim = () => {
    if (!invite || !user) return false;
    if (invite.used) return false;
    if (isExpired(invite.expiresAt)) return false;
    if (invite.approvals.length < invite.requiredApprovals) return false;
    if (invite.email && user.email !== invite.email) return false;
    return true;
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-forest mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invite...</p>
        </div>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <>
        <PageHero
          title="Invite Not Found"
          subtitle="Admin Invite"
          description="The invite you're looking for doesn't exist or has been removed."
        />
        <Section>
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  Invalid Invite
                </CardTitle>
                <CardDescription>
                  {error || 'This invite link is not valid.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/">Return Home</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Section>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PageHero
          title="Admin Invite"
          subtitle="Sign In Required"
          description="You need to sign in to claim this admin invite."
        />
        <Section>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-forest" />
                  Admin Role Invitation
                </CardTitle>
                <CardDescription>
                  You've been invited to become an admin for MDPU.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {getTimeRemaining(invite.expiresAt)}
                    </span>
                  </div>
                  {invite.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{invite.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {invite.approvals.length}/{invite.requiredApprovals} approvals
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      Expires: {formatDate(invite.adminExpiresAt) || 'Permanent'}
                    </span>
                  </div>
                </div>

                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">
                    Please sign in with your MDPU account to claim this invite.
                  </p>
                  <Button asChild>
                    <Link href={`/?signin=true&redirect=${encodeURIComponent(`/admin/invite?id=${inviteId}`)}`}>
                      Sign In to Claim
                    </Link>
                  </Button>
                </div>
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
        title="Admin Invite"
        subtitle="MDPU Administration"
        description="You've been invited to become an admin for the Mathamba Descendants Progressive Union."
      />

      <Section>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-forest" />
                Admin Role Invitation
              </CardTitle>
              <CardDescription>
                Review the invite details and claim your admin role.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Invite Status */}
              <div className="flex justify-center">
                {invite.used ? (
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    <XCircle className="w-4 h-4 mr-2" />
                    Already Used
                  </Badge>
                ) : isExpired(invite.expiresAt) ? (
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Expired
                  </Badge>
                ) : canClaim() ? (
                  <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Ready to Claim
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Pending Approval
                  </Badge>
                )}
              </div>

              {/* Invite Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Role</h4>
                  <p className="text-brand-forest font-medium capitalize">{invite.role}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Time Remaining</h4>
                  <p className={isExpired(invite.expiresAt) ? 'text-red-600 font-medium' : 'text-gray-900'}>
                    {getTimeRemaining(invite.expiresAt)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Approvals</h4>
                  <p className="text-gray-900">
                    {invite.approvals.length} of {invite.requiredApprovals} required
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Admin Role Expires</h4>
                  <p className="text-gray-900">
                    {formatDate(invite.adminExpiresAt) || 'Permanent'}
                  </p>
                </div>
                {invite.email && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-sm text-gray-700">Invited Email</h4>
                    <p className="text-gray-900">{invite.email}</p>
                  </div>
                )}
              </div>

              {/* Email Mismatch Warning */}
              {invite.email && user.email !== invite.email && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">Email Mismatch</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    This invite is for {invite.email}, but you're signed in as {user.email}.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="text-center">
                {canClaim() ? (
                  <Button
                    onClick={handleClaimInvite}
                    disabled={isClaiming}
                    size="lg"
                    className="bg-brand-forest hover:bg-brand-forest/90"
                  >
                    {isClaiming ? 'Claiming...' : 'Claim Admin Role'}
                  </Button>
                ) : invite.used ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">This invite has already been used.</p>
                    <Button asChild variant="outline">
                      <Link href="/">Return Home</Link>
                    </Button>
                  </div>
                ) : isExpired(invite.expiresAt) ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">This invite has expired (1-hour limit).</p>
                    <Button asChild variant="outline">
                      <Link href="/">Return Home</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      This invite requires {invite.requiredApprovals} approvals before it can be claimed.
                      Currently has {invite.approvals.length} approval{invite.approvals.length !== 1 ? 's' : ''}.
                    </p>
                    <Button asChild variant="outline">
                      <Link href="/">Return Home</Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Important Notes */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Admin invites expire after 1 hour and are single-use only</p>
                <p>• You'll gain admin access immediately after claiming</p>
                <p>• Your admin role will expire on the date shown above (if specified)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}

export default function InviteClaimPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-forest mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <InviteClaimContent />
    </Suspense>
  );
}

