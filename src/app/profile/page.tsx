'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHero } from '@/components/ui/custom/PageHero';
import { Section } from '@/components/ui/custom/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Profile, Payment, Application } from '@/types/firestore';
import { User, CreditCard, History, Upload, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && !loading) {
      loadUserData();
    }
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load profile
      const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
      if (profileDoc.exists()) {
        setProfile({ uid: user.uid, ...profileDoc.data() } as Profile);
      }

      // Load application if no profile exists
      if (!profileDoc.exists()) {
        const applicationQuery = query(
          collection(db, 'applications'),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const applicationSnapshot = await getDocs(applicationQuery);
        if (!applicationSnapshot.empty) {
          const appData = applicationSnapshot.docs[0].data();
          setApplication({ id: applicationSnapshot.docs[0].id, ...appData } as Application);
        }
      }

      // Load payments if profile exists
      if (profileDoc.exists()) {
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        const paymentsData = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Payment[];
        setPayments(paymentsData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripePayment = async (type: 'dues' | 'donation') => {
    if (!user) return;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          uid: user.uid,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error processing payment. Please try again.');
    }
  };

  const handleOfflinePayment = (method: 'bank' | 'orange' | 'afrimoney') => {
    // This would open a dialog with payment instructions
    alert(`${method} payment instructions would be shown here`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (timestamp: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
          subtitle="Sign In Required"
          description="You need to be signed in to view your profile."
        />
      </>
    );
  }

  // Show application status if no profile exists
  if (!profile && application) {
    return (
      <>
        <PageHero
          title="Application Status"
          subtitle="Membership Application"
          description="Your membership application status and next steps."
        />

        <Section>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  {application.status === 'pending' && <Clock className="w-5 h-5 text-yellow-600" />}
                  {application.status === 'approved' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {application.status === 'rejected' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Application Details</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <p><strong>Name:</strong> {application.fullName}</p>
                      <p><strong>Chapter:</strong> {application.chapter}</p>
                      <p><strong>Submitted:</strong> {formatDate(application.createdAt)}</p>
                    </div>
                  </div>

                  {application.status === 'pending' && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Your application is currently under review. You will receive an email notification once a decision has been made.
                      </p>
                    </div>
                  )}

                  {application.status === 'rejected' && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-800">
                        Your application was not approved at this time. You may contact us for more information or reapply in the future.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <PageHero
          title="No Profile Found"
          subtitle="Get Started"
          description="You haven't applied for membership yet."
        />

        <Section>
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle>Apply for Membership</CardTitle>
                <CardDescription>
                  Join the MDPU community and become part of our mission.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="bg-brand-forest hover:bg-brand-forest/90">
                  <a href="/apply">Apply Now</a>
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
        title="My Profile"
        subtitle={`Welcome, ${profile.fullName}`}
        description="Manage your membership, view contributions, and make payments."
      />

      <Section>
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p>{profile.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Chapter</p>
                      <p>{profile.chapter}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <Badge className={getStatusColor(profile.status)}>
                        {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Member Since</p>
                      <p>{formatDate(profile.joinDate)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Contribution Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Contributions</p>
                      <p className="text-2xl font-bold text-brand-forest">
                        {formatCurrency(profile.totals.contributions, 'USD')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Recent Payments</p>
                      <p>{payments.length} payments made</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Make a Payment</CardTitle>
                  <CardDescription>
                    Pay your membership dues or make a donation to support MDPU.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold">International Payments</h4>
                      <div className="space-y-2">
                        <Button 
                          onClick={() => handleStripePayment('dues')}
                          className="w-full bg-brand-forest hover:bg-brand-forest/90"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Dues ($50/year)
                        </Button>
                        <Button 
                          onClick={() => handleStripePayment('donation')}
                          variant="outline"
                          className="w-full"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Make Donation
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Sierra Leone Local</h4>
                      <div className="space-y-2">
                        <Button 
                          onClick={() => handleOfflinePayment('bank')}
                          variant="outline"
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Bank Transfer
                        </Button>
                        <Button 
                          onClick={() => handleOfflinePayment('orange')}
                          variant="outline"
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Orange Money
                        </Button>
                        <Button 
                          onClick={() => handleOfflinePayment('afrimoney')}
                          variant="outline"
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          AfriMoney
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    Your payment history and transaction details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No payments found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">
                                {payment.type === 'dues' ? 'Membership Dues' : 'Donation'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDate(payment.createdAt)} • {payment.method}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {formatCurrency(payment.amount, payment.currency)}
                              </p>
                              <Badge className={getStatusColor(payment.status)}>
                                {payment.status}
                              </Badge>
                            </div>
                          </div>
                          {payment.refs?.reference && (
                            <p className="text-sm text-gray-600">
                              Reference: {payment.refs.reference}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Account History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-400 pl-4">
                      <p className="font-medium">Membership Approved</p>
                      <p className="text-sm text-gray-600">{formatDate(profile.joinDate)}</p>
                    </div>
                    {payments.map((payment) => (
                      <div key={payment.id} className="border-l-4 border-blue-400 pl-4">
                        <p className="font-medium">
                          Payment {payment.status === 'succeeded' ? 'Completed' : 'Submitted'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(payment.createdAt)} • {formatCurrency(payment.amount, payment.currency)}
                        </p>
                      </div>
                    ))}
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
