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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, functions, auth } from '@/lib/firebase';
import { Application, Member, Project, Event, Payment, MonthlyReport, Document } from '@/types/firestore';
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
  AlertCircle,
  Shield,
  Home,
  FileText,
  Eye
} from 'lucide-react';
import { addDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentTitle, setDocumentTitle] = useState('');
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({
    fullName: '',
    email: '',
    chapter: '',
    role: '',
    bio: '',
    password: '' // Add password for auto-creating accounts
  });

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
        id: doc.id, // Use id instead of uid for consistency
        uid: doc.data().uid || doc.id, // Keep uid for backward compatibility
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
      const reportsQuery = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const reportsSnapshot = await getDocs(reportsQuery);
      const reportsData = reportsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MonthlyReport[];
      setReports(reportsData);

      // Load documents
      console.log('Loading documents...');
      const documentsQuery = query(collection(db, 'documents'), orderBy('uploadedAt', 'desc'));
      const documentsSnapshot = await getDocs(documentsQuery);
      const documentsData = documentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
      console.log('Documents loaded:', documentsData.length, documentsData);
      setDocuments(documentsData);

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      const application = applications.find(app => app.id === applicationId);
      if (!application) {
        alert('Application not found');
        return;
      }

      console.log('Approving application:', application);

      // Step 1: Update application status
      await updateDoc(doc(db, 'applications', applicationId), {
        status: 'approved',
        updatedAt: new Date(),
        approvedBy: user?.uid,
        approvedAt: new Date(),
      });

      // Step 2: Create member profile (public)
      await addDoc(collection(db, 'members'), {
        uid: applicationId, // Use application ID as member ID
        fullName: application.fullName,
        email: application.email,
        chapter: application.chapter,
        role: 'Member',
        joinDate: new Date(),
        status: 'active',
        createdAt: new Date(),
        phone: (application as any).phone || '',
        fatherName: (application as any).fatherName || '',
        motherName: (application as any).motherName || '',
        country: (application as any).country || '',
        city: (application as any).city || '',
      });

      // Step 3: Create Firebase Auth account
      if ((application as any).password) {
        try {
          // Temporarily sign out current admin to create new user
          const currentUser = auth.currentUser;
          await auth.signOut();
          
          // Create new user account
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            application.email, 
            (application as any).password
          );
          
          console.log('Account created:', userCredential.user.uid);
          
          // Update application with auth UID
          await updateDoc(doc(db, 'applications', applicationId), {
            accountCreated: true,
            authUID: userCredential.user.uid,
            accountCreatedAt: new Date(),
          });

          alert(`✅ SUCCESS! 
          
Application approved and account created for ${application.fullName}!

📧 Email: ${application.email}
🔐 Password: ${(application as any).password}
🆔 Account ID: ${userCredential.user.uid}

The member can now sign in using "Members Sign In" button.

⚠️ Note: You will need to sign back in as admin.`);
          
          // Redirect to sign-in page
          window.location.href = '/auth/signin?redirect=/admin';
          
        } catch (accountError: any) {
          console.error('Error creating account:', accountError);
          
          // Re-authenticate admin if account creation failed
          alert(`✅ Application approved and member created! 

📋 MEMBER ACCOUNT DETAILS:
📧 Email: ${application.email}
🔐 Password: ${(application as any).password}

🔧 NEXT STEP - Create Account Manually:
1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Use the email and password above
4. Then the member can sign in!

Link: https://console.firebase.google.com/project/mdpu-website/authentication/users`);
        }
      } else {
        alert(`Application approved and member created! 

⚠️ No password provided in application - account creation skipped.`);
      }

      loadAdminData();
    } catch (error: any) {
      console.error('Error approving application:', error);
      alert(`Error approving application: ${error.message}`);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add to members collection (public profiles)
      const memberDoc = await addDoc(collection(db, 'members'), {
        fullName: newMember.fullName,
        email: newMember.email,
        chapter: newMember.chapter,
        role: newMember.role || 'Member',
        bio: newMember.bio,
        joinDate: new Date(),
        status: 'active',
        createdAt: new Date(),
      });

      // Auto-create Firebase Auth account if password provided
      if (newMember.password) {
        try {
          // Temporarily sign out current admin to create new user
          const currentUser = auth.currentUser;
          await auth.signOut();
          
          // Create new user account
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            newMember.email, 
            newMember.password
          );
          
          console.log('Account created for manually added member:', userCredential.user.uid);
          
          // Update member document with auth UID
          await updateDoc(doc(db, 'members', memberDoc.id), {
            authUID: userCredential.user.uid,
            accountCreated: true,
            accountCreatedAt: new Date(),
            accountCreatedBy: user?.uid,
          });

          alert(`✅ SUCCESS! 
          
Member added and account created for ${newMember.fullName}!

📧 Email: ${newMember.email}
🔐 Password: ${newMember.password}
🆔 Account ID: ${userCredential.user.uid}

The member can now sign in using "Members Sign In" button.

⚠️ Note: You will need to sign back in as admin.`);
          
          // Redirect to sign-in page
          window.location.href = '/auth/signin?redirect=/admin';
          
        } catch (accountError: any) {
          console.error('Error creating account for manual member:', accountError);
          
          alert(`✅ Member added successfully! 

📋 MEMBER ACCOUNT DETAILS:
📧 Email: ${newMember.email}
🔐 Password: ${newMember.password}

🔧 NEXT STEP - Create Account Manually:
1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Use the email and password above
4. Then the member can sign in!

Link: https://console.firebase.google.com/project/mdpu-website/authentication/users`);
        }
      } else {
        alert('Member added successfully! No password provided - account creation skipped.');
      }

      // Reset form and close
      setNewMember({
        fullName: '',
        email: '',
        chapter: '',
        role: '',
        bio: '',
        password: ''
      });
      setShowAddMemberForm(false);
      loadAdminData();
      
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding member. Please try again.');
    }
  };

  // Handle editing a member
  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setNewMember({
      fullName: member.fullName,
      email: member.email,
      chapter: member.chapter,
      role: member.role || '',
      bio: member.bio || '',
      password: ''
    });
    setShowAddMemberForm(true);
  };

  // Handle updating a member
  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Update member called:', editingMember);
    
    if (!editingMember) {
      alert('No member selected for editing');
      return;
    }
    
    if (!editingMember.id) {
      alert('Member ID is missing');
      console.error('Member data:', editingMember);
      return;
    }
    
    try {
      console.log('Updating member with ID:', editingMember.id);
      
      // Update member in Firestore
      await updateDoc(doc(db, 'members', editingMember.id), {
        fullName: newMember.fullName,
        email: newMember.email,
        chapter: newMember.chapter,
        role: newMember.role || 'Member',
        bio: newMember.bio,
        updatedAt: new Date(),
      });

      alert('Member updated successfully!');

      // Reset form and close
      setEditingMember(null);
      setNewMember({
        fullName: '',
        email: '',
        chapter: '',
        role: '',
        bio: '',
        password: ''
      });
      setShowAddMemberForm(false);
      loadAdminData();
      
    } catch (error: any) {
      console.error('Error updating member:', error);
      alert(`Error updating member: ${error.message}`);
    }
  };

  // Handle deleting a member and their Firebase Auth account
  const handleDeleteMember = async (member: Member) => {
    console.log('Delete member called:', member);
    
    if (!confirm(`Are you sure you want to delete ${member.fullName}? This will also delete their Firebase Auth account if it exists.`)) return;
    
    if (!member.id) {
      alert('Member ID is missing');
      console.error('Member data:', member);
      return;
    }
    
    try {
      console.log('Deleting member with ID:', member.id);
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'members', member.id));

      // Try to delete Firebase Auth account if it exists
      if (member.authUID) {
        try {
          // Call a Cloud Function to delete the user (since client can't delete other users)
          const deleteUserFunction = httpsCallable(functions, 'deleteUser');
          await deleteUserFunction({ uid: member.authUID });
          
          alert(`✅ Member ${member.fullName} deleted successfully!\n\n🔥 Firebase Auth account also deleted.`);
        } catch (authError: any) {
          console.error('Error deleting Firebase Auth account:', authError);
          
          alert(`✅ Member ${member.fullName} deleted from database!\n\n⚠️ Could not delete Firebase Auth account automatically.\n\n🔧 Manual deletion required:\n1. Go to Firebase Console → Authentication → Users\n2. Find and delete: ${member.email}\n\nLink: https://console.firebase.google.com/project/mdpu-website/authentication/users`);
        }
      } else {
        alert(`✅ Member ${member.fullName} deleted successfully!`);
      }

      loadAdminData();
      
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error deleting member. Please try again.');
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

  // Simple document upload function
  const uploadDocument = async (file: File) => {
    if (!file) {
      alert('No file selected');
      return;
    }

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    try {
      setUploadingDocument(true);

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64String = reader.result as string;
          
          // Save to Firestore
          await addDoc(collection(db, 'documents'), {
            title: documentTitle.trim(),
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            downloadURL: base64String,
            uploadedBy: user?.uid || 'unknown',
            uploadedAt: Timestamp.now(),
            isPublic: true,
            category: 'official'
          });

          alert(`✅ Document "${documentTitle}" uploaded successfully!`);
          setDocumentTitle('');
          console.log('Reloading admin data after document upload...');
          await loadAdminData();
          console.log('Admin data reloaded, documents state:', documents.length);
        } catch (error: any) {
          console.error('Error saving document:', error);
          alert(`❌ Error saving document: ${error.message}`);
        } finally {
          setUploadingDocument(false);
        }
      };

      reader.onerror = () => {
        alert('❌ Error reading file');
        setUploadingDocument(false);
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Error uploading document:', error);
      alert(`❌ Error uploading document: ${error.message}`);
      setUploadingDocument(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteDoc(doc(db, 'documents', documentId));
      alert('Document deleted successfully!');
      loadAdminData();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      alert(`Error deleting document: ${error.message}`);
    }
  };

  const handlePreviewDocument = (document: Document) => {
    // Open document in new tab
    if (document.downloadURL.startsWith('data:')) {
      // Base64 data
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>${document.title}</title></head>
            <body style="margin:0;">
              <embed src="${document.downloadURL}" width="100%" height="100%" type="application/pdf">
            </body>
          </html>
        `);
      }
    } else {
      // URL
      window.open(document.downloadURL, '_blank');
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
      {/* Admin Dashboard Hero - Dark Professional Theme */}
      <div className="relative bg-gradient-to-br from-slate-800 via-gray-900 to-black text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">MDPU Administration</span>
                </div>
                
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                  Admin Dashboard
                </h1>
                
                {/* Description */}
                <p className="text-base sm:text-lg text-gray-300 max-w-2xl">
                  Manage applications, content, and finances for the Mathamba Descendants Progressive Union.
                </p>
              </div>
              
              {/* Admin Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/admin/roles">
                    <Shield className="w-4 h-4 mr-2" />
                    Manage Admin Roles
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  <Link href="/profile/dashboard">
                    <Home className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Section className="bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

          {/* Super Admin Role Management */}
          {isSuperAdmin && (
            <Card className="mb-6 border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Users className="w-5 h-5" />
                  Super Admin Controls
                </CardTitle>
                <CardDescription>
                  Manage admin roles and permissions for MDPU officers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/admin/roles">
                    Manage Admin Roles
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="applications" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="applications" className="text-xs sm:text-sm">Applications</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs sm:text-sm">Documents</TabsTrigger>
              <TabsTrigger value="content" className="text-xs sm:text-sm">Content</TabsTrigger>
              <TabsTrigger value="finance" className="text-xs sm:text-sm">Finance</TabsTrigger>
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
                            <div className="flex gap-2 items-center">
                              <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setExpandedApplication(
                                  expandedApplication === application.id ? null : application.id!
                                )}
                              >
                                {expandedApplication === application.id ? 'Hide Details' : 'View Details'}
                              </Button>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {expandedApplication === application.id && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <h4 className="font-medium mb-3">Complete Application Details</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p><strong>Full Name:</strong> {application.fullName}</p>
                                  <p><strong>Email:</strong> {application.email}</p>
                                  <p><strong>Phone:</strong> {(application as any).phone || 'Not provided'}</p>
                                  <p><strong>Chapter:</strong> {application.chapter}</p>
                                </div>
                                <div>
                                  <p><strong>Father's Name:</strong> {(application as any).fatherName || 'Not provided'}</p>
                                  <p><strong>Mother's Name:</strong> {(application as any).motherName || 'Not provided'}</p>
                                  <p><strong>Country:</strong> {(application as any).country || 'Not provided'}</p>
                                  <p><strong>City:</strong> {(application as any).city || 'Not provided'}</p>
                                </div>
                              </div>
                              
                              {application.notes && (
                                <div className="mt-4">
                                  <p className="font-medium text-gray-700">Additional Message:</p>
                                  <p className="text-gray-600 bg-white p-3 rounded border mt-1">{application.notes}</p>
                                </div>
                              )}

                              <div className="mt-4 p-3 bg-blue-50 rounded border">
                                <p className="text-sm text-blue-800">
                                  <strong>Application ID:</strong> {application.id}
                                </p>
                                <p className="text-sm text-blue-800">
                                  <strong>Submitted:</strong> {formatDate(application.createdAt)}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {application.notes && !expandedApplication && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700">Notes:</p>
                              <p className="text-sm text-gray-600">{application.notes.substring(0, 100)}...</p>
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

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Document Management
                  </CardTitle>
                  <CardDescription>
                    Upload and manage official documents like Constitution, Bylaws, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Document Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Upload Document</h3>
                      <p className="text-gray-600 mb-4">
                        Enter a title and click the button to upload your PDF
                      </p>
                      <div className="space-y-4">
                        <Input
                          type="text"
                          placeholder="Document title (e.g., Constitution)"
                          value={documentTitle}
                          onChange={(e) => setDocumentTitle(e.target.value)}
                          className="max-w-md mx-auto"
                        />
                        <div>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && documentTitle.trim()) {
                                uploadDocument(file);
                              } else if (!documentTitle.trim()) {
                                alert('Please enter a document title first');
                              }
                            }}
                            style={{ display: 'none' }}
                            id="pdf-upload"
                          />
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              if (!documentTitle.trim()) {
                                alert('Please enter a document title first');
                                return;
                              }
                              const input = document.getElementById('pdf-upload') as HTMLInputElement;
                              input?.click();
                            }}
                            disabled={uploadingDocument}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingDocument ? 'Uploading...' : 'Choose PDF File'}
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF files only, max 10MB
                      </p>
                      {uploadingDocument && (
                        <div className="mt-4">
                          <div className="flex items-center justify-center gap-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm">Processing document...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Existing Documents */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
                    <div className="space-y-3">
                      {documents.length > 0 ? (
                        documents.map((document) => (
                          <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-8 h-8 text-red-600" />
                              <div>
                                <h4 className="font-medium">{document.title}</h4>
                                <p className="text-sm text-gray-600">
                                  Uploaded {new Date(document.uploadedAt.toDate()).toLocaleDateString()} • 
                                  {(document.fileSize / (1024 * 1024)).toFixed(1)} MB
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePreviewDocument(document)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Preview
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const link = window.document.createElement('a');
                                  link.href = document.downloadURL;
                                  link.download = document.fileName;
                                  link.click();
                                }}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteDocument(document.id!, document.title)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No documents uploaded yet</p>
                          <p className="text-sm">Upload your first document using the form above</p>
                        </div>
                      )}
                    </div>
                  </div>
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
                      <Button size="sm" onClick={() => setShowAddMemberForm(true)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Member
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {showAddMemberForm && (
                      <div className="border rounded-lg p-4 mb-4 bg-blue-50">
                        <h4 className="font-medium mb-3">{editingMember ? 'Edit Member' : 'Add New Member'}</h4>
                        <form onSubmit={editingMember ? handleUpdateMember : handleAddMember} className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              placeholder="Full Name"
                              value={newMember.fullName}
                              onChange={(e) => setNewMember({...newMember, fullName: e.target.value})}
                              required
                            />
                            <Input
                              type="email"
                              placeholder="Email"
                              value={newMember.email}
                              onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              placeholder="Chapter/Location"
                              value={newMember.chapter}
                              onChange={(e) => setNewMember({...newMember, chapter: e.target.value})}
                              required
                            />
                            <Input
                              placeholder="Role/Position"
                              value={newMember.role}
                              onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                            />
                          </div>
                          <Textarea
                            placeholder="Bio (optional)"
                            value={newMember.bio}
                            onChange={(e) => setNewMember({...newMember, bio: e.target.value})}
                            className="min-h-[80px]"
                          />
                          {!editingMember && (
                            <Input
                              type="password"
                              placeholder="Password (optional - for auto-creating account)"
                              value={newMember.password}
                              onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                            />
                          )}
                          <div className="flex gap-2">
                            <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                              {editingMember ? 'Update Member' : 'Add Member'}
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => {
                              setShowAddMemberForm(false);
                              setEditingMember(null);
                              setNewMember({
                                fullName: '',
                                email: '',
                                chapter: '',
                                role: '',
                                bio: '',
                                password: ''
                              });
                            }}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {members.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          No members found. Add members manually or approve applications.
                        </div>
                      ) : (
                        members.map((member) => (
                          <div key={member.uid} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <p className="font-medium">{member.fullName}</p>
                              <p className="text-sm text-gray-600">{member.chapter}</p>
                              {member.role && <p className="text-xs text-blue-600">{member.role}</p>}
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => handleEditMember(member)}>
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteMember(member)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
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
