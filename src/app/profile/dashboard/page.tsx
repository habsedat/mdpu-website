'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { PageHero } from '@/components/ui/custom/PageHero';
import { Section } from '@/components/ui/custom/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign,
  Settings,
  Shield,
  Heart,
  Users,
  FileText,
  Home
} from 'lucide-react';
import Link from 'next/link';

export default function MemberDashboard() {
  const { user, isAdmin, isSuperAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const [memberData, setMemberData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && !loading) {
      loadMemberData();
      
      // Prevent going back to sign-in page
      const handlePopState = (event: PopStateEvent) => {
        if (window.location.pathname === '/auth/signin') {
          router.replace('/');
        }
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [user, loading, router]);

  const loadMemberData = async () => {
    try {
      // Load member profile from members collection
      const membersQuery = query(
        collection(db, 'members'), 
        where('email', '==', user!.email)
      );
      const membersSnapshot = await getDocs(membersQuery);
      
      if (!membersSnapshot.empty) {
        setMemberData(membersSnapshot.docs[0].data());
      }

      // Load private profile if exists
      const profileDoc = await getDoc(doc(db, 'profiles', user!.uid));
      if (profileDoc.exists()) {
        setProfileData(profileDoc.data());
      }

      // Load user's payments
      const paymentsQuery = query(
        collection(db, 'payments'), 
        where('email', '==', user!.email)
      );
      const paymentsSnapshot = await getDocs(paymentsQuery);
      const paymentsData = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPayments(paymentsData);

    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-forest mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <PageHero
          title="Access Denied"
          subtitle="Member Profile"
          description="Please sign in to access your member dashboard."
        />
        <Section>
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-6">
                <Button asChild>
                  <Link href="/auth/signin?redirect=/profile/dashboard">
                    Sign In
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Section>
      </>
    );
  }

  const totalContributions = payments
    .filter(payment => payment.status === 'succeeded' || payment.status === 'verified')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  return (
    <>
      <PageHero
        title="Member Dashboard"
        subtitle="MDPU Member Portal"
        description="Welcome to your personal MDPU member dashboard"
      />

      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Header with Admin Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-forest rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-charcoal">
                  {memberData?.fullName || user.displayName || user.email}
                </h1>
                <p className="text-gray-600">{memberData?.chapter || 'MDPU Member'}</p>
                <div className="flex gap-2 mt-1">
                  <Badge className="bg-green-100 text-green-800">Active Member</Badge>
                  {isAdmin && (
                    <Badge className="bg-purple-100 text-purple-800">
                      {isSuperAdmin ? 'Super Admin' : 'Admin'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* Home Button */}
              <Button asChild variant="outline">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              
              {/* Admin Dashboard Button - Only for Admins */}
              {isAdmin && (
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/admin">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                </Button>
              )}
              
              <Button onClick={logout} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDate(memberData?.joinDate || memberData?.createdAt)}
                </div>
                <p className="text-xs text-muted-foreground">Join date</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalContributions)}</div>
                <p className="text-xs text-muted-foreground">{payments.length} transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chapter</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{memberData?.chapter || 'Not assigned'}</div>
                <p className="text-xs text-muted-foreground">Local chapter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600">Active</div>
                <p className="text-xs text-muted-foreground">Membership status</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{user.email}</span>
                    </div>
                    {memberData?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{memberData.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{memberData?.chapter || 'Chapter not assigned'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Joined {formatDate(memberData?.joinDate)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Profile
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Heart className="w-4 h-4 mr-2" />
                      Make Donation
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      View Constitution
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Contact Chapter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contributions Tab */}
            <TabsContent value="contributions">
              <Card>
                <CardHeader>
                  <CardTitle>Contribution History</CardTitle>
                  <CardDescription>
                    Your financial contributions to MDPU
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <div className="text-center py-8">
                      <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No contributions yet</p>
                      <Button asChild className="mt-4">
                        <Link href="/donate">Make Your First Donation</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{formatCurrency(payment.amount, payment.currency)}</p>
                            <p className="text-sm text-gray-600">
                              {payment.method} • {formatDate(payment.createdAt)}
                            </p>
                          </div>
                          <Badge className={payment.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {payment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    MDPU events and meetings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming events</p>
                    <Button asChild className="mt-4" variant="outline">
                      <Link href="/events">View All Events</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Member Documents</CardTitle>
                  <CardDescription>
                    Important documents and resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">MDPU Constitution</p>
                        <p className="text-sm text-gray-600">Organization constitution and bylaws</p>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href="/constitution">View</Link>
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Member Handbook</p>
                        <p className="text-sm text-gray-600">Guidelines and procedures</p>
                      </div>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Membership Certificate</p>
                        <p className="text-sm text-gray-600">Official membership certificate</p>
                      </div>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </>
  );
}
