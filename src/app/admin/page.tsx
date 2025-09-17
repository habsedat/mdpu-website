'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHero } from '@/components/ui/custom/PageHero';
import { Section } from '@/components/ui/custom/Section';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Application, Member, Project, Event, Payment, MonthlyReport } from '@/types/firestore';
import { 
  Users, 
  DollarSign, 
  Check, 
  X, 
  Upload, 
  Edit, 
  Trash2, 
  Plus,
  Download,
  Calendar,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && isAdmin && !loading) {
      loadAdminData();
    }
  }, [user, isAdmin, loading]);

  const loadAdminData = async () => {
    try {
      // Load applications
      const applicationsQuery = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      const applicationsSnapshot = await getDocs(applicationsQuery);
      const applicationsData = applicationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Application[];
      setApplications(applicationsData);

      // Load members
      const membersQuery = query(collection(db, 'members'), orderBy('fullName'));
      const membersSnapshot = await getDocs(membersQuery);
      const membersData = membersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as Member[];
      setMembers(membersData);

      // Load projects
      const projectsQuery = query(collection(db, 'projects'), orderBy('updatedAt', 'desc'));
      const projectsSnapshot = await getDocs(projectsQuery);
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);

      // Load events
      const eventsQuery = query(collection(db, 'events'), orderBy('dateStart', 'desc'));
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      setEvents(eventsData);

      // Load payments
      const paymentsQuery = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
      const paymentsSnapshot = await getDocs(paymentsQuery);
      const paymentsData = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
      setPayments(paymentsData);

      // Load reports
      const reportsQuery = query(collection(db, 'reports/monthly'), orderBy('id', 'desc'));
      const reportsSnapshot = await getDocs(reportsQuery);
      const reportsData = reportsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MonthlyReport[];
      setReports(reportsData);

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId }),
      });

      if (response.ok) {
        // Refresh data
        loadAdminData();
        alert('Application approved successfully!');
      } else {
        throw new Error('Failed to approve application');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Error approving application. Please try again.');
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to reject this application?')) return;

    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status: 'rejected',
        updatedAt: new Date(),
      });

      loadAdminData();
      alert('Application rejected.');
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Error rejecting application. Please try again.');
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'verified',
        verifiedAt: new Date(),
        verifiedBy: user?.uid,
      });

      loadAdminData();
      alert('Payment verified successfully!');
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Error verifying payment. Please try again.');
    }
  };

  const exportPaymentsCSV = () => {
    const csvData = payments.map(payment => ({
      Date: payment.createdAt?.toDate?.()?.toISOString?.() || payment.createdAt,
      Amount: payment.amount,
      Currency: payment.currency,
      Method: payment.method,
      Type: payment.type,
      Status: payment.status,
      Reference: payment.refs?.reference || '',
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mdpu-payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'approved': case 'succeeded': case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected': case 'failed': case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-forest mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <>
        <PageHero
          title="Access Denied"
          subtitle="Admin Only"
          description="You don't have permission to access this page."
        />
        <Section>
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  Insufficient Permissions
                </CardTitle>
                <CardDescription>
                  This page is restricted to administrators only.
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

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const pendingPayments = payments.filter(payment => payment.status === 'pending');
  const totalRevenue = payments
    .filter(payment => payment.status === 'succeeded' || payment.status === 'verified')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <>
      <PageHero
        title="Admin Dashboard"
        subtitle="MDPU Administration"
        description="Manage applications, content, and finances for the Mathamba Descendants Progressive Union."
      />

      <Section>
        <div className="max-w-7xl mx-auto">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingApplications.length}</div>
                <p className="text-xs text-muted-foreground">
                  {applications.length} total applications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members.length}</div>
                <p className="text-xs text-muted-foreground">
                  Public member profiles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingPayments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Require verification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  All verified payments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="applications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Membership Applications</CardTitle>
                  <CardDescription>
                    Review and manage pending membership applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingApplications.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No pending applications</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingApplications.map((application) => (
                        <div key={application.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">{application.fullName}</h3>
                              <p className="text-gray-600">{application.email}</p>
                              <p className="text-sm text-gray-500">
                                {application.chapter} • Applied {formatDate(application.createdAt)}
                              </p>
                            </div>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                          </div>
                          
                          {application.notes && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700">Notes:</p>
                              <p className="text-sm text-gray-600">{application.notes}</p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveApplication(application.id!)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectApplication(application.id!)}
                              size="sm"
                              variant="destructive"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Members Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Public Members
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Member
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {members.map((member) => (
                        <div key={member.uid} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{member.fullName}</p>
                            <p className="text-sm text-gray-600">{member.chapter}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Projects Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Projects
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Project
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {projects.slice(0, 5).map((project) => (
                        <div key={project.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{project.title}</p>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Events Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Events
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Event
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {events.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-gray-600">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {formatDate(event.dateStart)}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Media Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Media Library
                      <Button size="sm">
                        <Upload className="w-4 h-4 mr-1" />
                        Upload Media
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Media management interface</p>
                      <p className="text-sm text-gray-500">Upload and organize images and videos</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Finance Tab */}
            <TabsContent value="finance">
              <div className="space-y-6">
                {/* Payment Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Finance Overview
                      <Button onClick={exportPaymentsCSV} size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Export CSV
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          ${payments.filter(p => p.status === 'succeeded' || p.status === 'verified').reduce((s, p) => s + p.amount, 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-green-700">Total Revenue</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">
                          ${payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-yellow-700">Pending Verification</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {payments.length}
                        </p>
                        <p className="text-sm text-blue-700">Total Transactions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Payments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Payments</CardTitle>
                    <CardDescription>
                      Latest payment transactions requiring attention.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {payments.slice(0, 10).map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {formatCurrency(payment.amount, payment.currency)}
                              </p>
                              <Badge className={getStatusColor(payment.status)}>
                                {payment.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {payment.method} • {payment.type} • {formatDate(payment.createdAt)}
                            </p>
                            {payment.refs?.reference && (
                              <p className="text-xs text-gray-500">
                                Ref: {payment.refs.reference}
                              </p>
                            )}
                          </div>
                          {payment.status === 'pending' && (
                            <Button
                              onClick={() => handleVerifyPayment(payment.id!)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Verify
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Reports */}
                {reports.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {reports.slice(0, 6).map((report) => (
                          <div key={report.id} className="flex justify-between items-center p-3 border rounded">
                            <div>
                              <p className="font-medium">{report.id}</p>
                              <p className="text-sm text-gray-600">
                                {report.count} transactions • {formatCurrency(report.totalAmount, 'USD')}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </>
  );
}
