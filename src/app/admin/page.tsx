'use client';

import { useState, useEffect, useRef } from 'react';
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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, functions, auth, storage } from '@/lib/firebase';
import { Application, Member, Project, Event, Payment, MonthlyReport, Document, LeadershipPosition, LeadershipAssignment, Media, ProjectStatus, NewsPost, NewsCategory, NewsStatus } from '@/types/firestore';
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
  Eye,
  Crown,
  UserCheck,
  UserMinus,
  Search,
  Play
} from 'lucide-react';
import { addDoc } from 'firebase/firestore';

// PROFESSIONAL VIDEO DISPLAY - MATCHING PUBLIC NEWS LAYOUT
interface AdminVideoPreviewProps {
  src: string;
  videoName: string;
  index: number;
  className?: string;
}

function AdminVideoPreview({ src, videoName, index, className = '' }: AdminVideoPreviewProps) {
  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-lg ${className}`}>
      <div className="bg-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white font-semibold text-sm">📹 {videoName}</span>
        </div>
        <span className="text-slate-300 text-xs">Admin Preview</span>
      </div>
      <div className="p-3">
        <video
          src={src}
          controls
          preload="metadata"
          className="w-full rounded-lg shadow-md"
          style={{ maxHeight: '300px', backgroundColor: '#1f2937' }}
          onError={(e) => {
            e.currentTarget.style.display = 'block';
          }}
        >
          <p className="text-white text-center py-4 text-sm">
            Video preview unavailable
          </p>
        </video>
      </div>
    </div>
  );
}

// LeadershipCard Component
interface LeadershipCardProps {
  leader: {
    id: string;
    member: Member;
    position: string;
    assignedAt: any;
  };
  onRemove: () => void;
}

function LeadershipCard({ leader, onRemove }: LeadershipCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {/* Display actual profile picture or fallback */}
          {leader.member.profilePictureURL ? (
            <img 
              src={leader.member.profilePictureURL} 
              alt={leader.member.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {leader.member.fullName.charAt(0)}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">{leader.member.fullName}</h4>
            <p className="text-sm text-blue-600 font-medium">{leader.position}</p>
            <p className="text-xs text-gray-500">{leader.member.chapter}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <UserMinus className="w-4 h-4" />
        </Button>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Assigned: {leader.assignedAt?.toDate ? leader.assignedAt.toDate().toLocaleDateString() : 'N/A'}
        </p>
      </div>
    </div>
  );
}

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
  const [leadershipPositions, setLeadershipPositions] = useState<LeadershipPosition[]>([]);
  const [leadershipAssignments, setLeadershipAssignments] = useState<LeadershipAssignment[]>([]);
  const [selectedMemberForLeadership, setSelectedMemberForLeadership] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Search states
  const [memberSearch, setMemberSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [applicationSearch, setApplicationSearch] = useState('');
  const [documentSearch, setDocumentSearch] = useState('');
  
  // Event management states
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventThumbnail, setEventThumbnail] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    dateStart: '',
    dateEnd: '',
    timeStart: '',
    timeEnd: '',
    location: '',
    description: '',
    details: '',
    category: '',
    isPublic: true,
    maxAttendees: '',
    registrationRequired: false,
    contactEmail: ''
  });
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

  // Project management states
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectCover, setProjectCover] = useState<string | null>(null);
  const [uploadingProjectCover, setUploadingProjectCover] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    summary: '',
    body: '',
    status: 'planning' as ProjectStatus
  });

  // News Engine states (formerly Media Library)
  const [newsItems, setNewsItems] = useState<NewsPost[]>([]);
  const [showCreateNewsForm, setShowCreateNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsPost | null>(null);
  const [uploadingNewsMedia, setUploadingNewsMedia] = useState(false);
  const [creatingNews, setCreatingNews] = useState(false);
  const [newsSearch, setNewsSearch] = useState('');
  const [newNewsPost, setNewNewsPost] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'general' as NewsCategory,
    status: 'draft' as NewsStatus,
    tags: '',
    isUrgent: false,
    location: ''
  });
  const [newsFeaturedImage, setNewsFeaturedImage] = useState<string | null>(null);
  const [newsImages, setNewsImages] = useState<string[]>([]);
  const [newsVideos, setNewsVideos] = useState<string[]>([]);

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

      // Load leadership assignments
      console.log('Loading leadership assignments...');
      const leadershipQuery = query(collection(db, 'leadership'), orderBy('assignedAt', 'desc'));
      const leadershipSnapshot = await getDocs(leadershipQuery);
      const leadershipData = leadershipSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeadershipAssignment[];
      console.log('Leadership assignments loaded:', leadershipData.length, leadershipData);
      setLeadershipAssignments(leadershipData);

      // Load news posts
      console.log('Loading news posts...');
      const newsQuery = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      const newsSnapshot = await getDocs(newsQuery);
      const newsData = newsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsPost[];
      console.log('News posts loaded:', newsData.length, newsData);
      setNewsItems(newsData);

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Leadership Management Functions
  const assignLeadership = async () => {
    if (!selectedMemberForLeadership || !selectedPosition || !user) return;

    try {
      const selectedMember = members.find(m => m.id === selectedMemberForLeadership);
      if (!selectedMember) {
        alert('Selected member not found');
        return;
      }

      // Check if this position is already assigned
      const existingAssignment = leadershipAssignments.find(
        assignment => assignment.positionId === selectedPosition && assignment.isActive
      );

      if (existingAssignment) {
        const confirmReplace = confirm(`${selectedPosition} is already assigned. Do you want to replace the current assignment?`);
        if (confirmReplace) {
          // Deactivate existing assignment
          await updateDoc(doc(db, 'leadership', existingAssignment.id!), {
            isActive: false,
            endDate: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
        } else {
          return;
        }
      }

      // Create new leadership assignment
      const newAssignment: Omit<LeadershipAssignment, 'id'> = {
        positionId: selectedPosition,
        memberId: selectedMember.id!,
        memberUID: selectedMember.uid,
        startDate: Timestamp.now(),
        isActive: true,
        assignedBy: user.uid,
        assignedAt: Timestamp.now(),
        notes: `Assigned ${selectedPosition} to ${selectedMember.fullName}`
      };

      await addDoc(collection(db, 'leadership'), newAssignment);

      // Update member's role field for backward compatibility
      await updateDoc(doc(db, 'members', selectedMember.id!), {
        role: selectedPosition,
        updatedAt: Timestamp.now()
      });

      // Reset form
      setSelectedMemberForLeadership('');
      setSelectedPosition('');

      // Reload data
      loadAdminData();

      // Simple success notification
      alert(`✅ Leadership assigned successfully!\n\n👑 ${selectedMember.fullName} is now ${selectedPosition}\n🌐 Their profile is visible on the leadership page.`);
    } catch (error) {
      console.error('Error assigning leadership:', error);
      alert('Failed to assign leadership position');
    }
  };

  const removeLeadership = async (assignmentId: string) => {
    try {
      const assignment = leadershipAssignments.find(a => a.id === assignmentId);
      if (!assignment) return;

      const confirmRemoval = confirm(`Are you sure you want to remove this leadership assignment?`);
      if (!confirmRemoval) return;

      // Deactivate assignment
      await updateDoc(doc(db, 'leadership', assignmentId), {
        isActive: false,
        endDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Clear member's role field
      const member = members.find(m => m.id === assignment.memberId);
      if (member) {
        await updateDoc(doc(db, 'members', member.id!), {
          role: '',
          updatedAt: Timestamp.now()
        });
      }

      // Reload data
      loadAdminData();

      alert('Leadership assignment removed successfully');
    } catch (error) {
      console.error('Error removing leadership:', error);
      alert('Failed to remove leadership assignment');
    }
  };

  const getCurrentLeaders = (category: string) => {
    const activeAssignments = leadershipAssignments.filter(assignment => assignment.isActive);
    
    return activeAssignments
      .map(assignment => {
        const member = members.find(m => m.id === assignment.memberId);
        if (!member) return null;
        
        const positionCategory = getPositionCategory(assignment.positionId);
        if (positionCategory !== category) return null;
        
        return {
          ...assignment,
          member,
          position: assignment.positionId
        };
      })
      .filter(Boolean) as any[];
  };

  const getPositionCategory = (position: string) => {
    const executivePositions = ['Chairman', 'Vice President', 'Secretary General', 'DP Secretary General', 'Treasurer'];
    const boardPositions = ['Board Member - Finance', 'Board Member - Projects', 'Board Member - Community Relations', 'Board Member - Youth Affairs'];
    
    if (executivePositions.includes(position)) return 'executive';
    if (boardPositions.includes(position) || position.includes('Board Member')) return 'board';
    if (position.includes('Chapter President')) return 'chapter';
    return 'other';
  };

  // Search filter functions
  const filteredMembers = members.filter(member =>
    member.fullName.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.chapter.toLowerCase().includes(memberSearch.toLowerCase()) ||
    (member.role && member.role.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
    project.summary.toLowerCase().includes(projectSearch.toLowerCase()) ||
    project.status.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
    event.location.toLowerCase().includes(eventSearch.toLowerCase()) ||
    event.details.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const filteredApplications = applications.filter(application =>
    application.fullName.toLowerCase().includes(applicationSearch.toLowerCase()) ||
    application.email.toLowerCase().includes(applicationSearch.toLowerCase()) ||
    application.chapter.toLowerCase().includes(applicationSearch.toLowerCase()) ||
    application.status.toLowerCase().includes(applicationSearch.toLowerCase())
  );

  const filteredDocuments = documents.filter(document =>
    document.title.toLowerCase().includes(documentSearch.toLowerCase()) ||
    document.fileName.toLowerCase().includes(documentSearch.toLowerCase()) ||
    (document.description && document.description.toLowerCase().includes(documentSearch.toLowerCase()))
  );

  const filteredNews = newsItems.filter(news =>
    news.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
    news.summary.toLowerCase().includes(newsSearch.toLowerCase()) ||
    news.content.toLowerCase().includes(newsSearch.toLowerCase()) ||
    news.category.toLowerCase().includes(newsSearch.toLowerCase()) ||
    news.tags.some(tag => tag.toLowerCase().includes(newsSearch.toLowerCase())) ||
    (news.location && news.location.toLowerCase().includes(newsSearch.toLowerCase()))
  );

  // Event thumbnail upload function
  const handleThumbnailUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file for the event thumbnail');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Thumbnail file size must be less than 5MB');
      return;
    }

    try {
      setUploadingThumbnail(true);

      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setEventThumbnail(base64String);
        console.log('Event thumbnail uploaded successfully');
      };

      reader.onerror = () => {
        alert('Error reading thumbnail file');
        setUploadingThumbnail(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('Error uploading thumbnail');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Event Management Functions
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      // Validate required fields
      if (!newEvent.title || !newEvent.dateStart || !newEvent.timeStart || !newEvent.location || !newEvent.description) {
        alert('Please fill in all required fields (Title, Start Date, Start Time, Location, Description)');
        return;
      }

      // Create start and end timestamps
      const startDate = new Date(`${newEvent.dateStart}T${newEvent.timeStart}`);
      let endDate = startDate;
      
      if (newEvent.dateEnd && newEvent.timeEnd) {
        endDate = new Date(`${newEvent.dateEnd}T${newEvent.timeEnd}`);
      } else if (newEvent.timeEnd) {
        endDate = new Date(`${newEvent.dateStart}T${newEvent.timeEnd}`);
      }

      // Validate dates
      if (endDate < startDate) {
        alert('End date/time must be after start date/time');
        return;
      }

      // Prepare event data with proper field handling
      const eventData: any = {
        title: newEvent.title.trim(),
        dateStart: Timestamp.fromDate(startDate),
        dateEnd: Timestamp.fromDate(endDate),
        timeStart: newEvent.timeStart,
        timeEnd: newEvent.timeEnd || newEvent.timeStart,
        location: newEvent.location.trim(),
        description: newEvent.description.trim(),
        details: newEvent.details.trim() || newEvent.description.trim(),
        category: newEvent.category || 'General',
        isPublic: newEvent.isPublic,
        registrationRequired: newEvent.registrationRequired,
        contactEmail: newEvent.contactEmail.trim() || user.email || '',
        gallery: [],
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Only add optional fields if they have values
      if (eventThumbnail) {
        eventData.thumbnailUrl = eventThumbnail;
      }
      
      if (newEvent.maxAttendees) {
        // Remove commas and parse the number properly
        const cleanNumber = newEvent.maxAttendees.replace(/[,\s]/g, '');
        const parsedNumber = parseInt(cleanNumber);
        if (parsedNumber > 0) {
          eventData.maxAttendees = parsedNumber;
        }
      }

      await addDoc(collection(db, 'events'), eventData);

      // Reset form
      setNewEvent({
        title: '',
        dateStart: '',
        dateEnd: '',
        timeStart: '',
        timeEnd: '',
        location: '',
        description: '',
        details: '',
        category: '',
        isPublic: true,
        maxAttendees: '',
        registrationRequired: false,
        contactEmail: ''
      });
      setEventThumbnail(null);
      setShowAddEventForm(false);
      loadAdminData();
      
      alert(`✅ Event "${newEvent.title}" created successfully!\n\n🌐 Event will ${newEvent.isPublic ? 'appear on public events page' : 'remain private'}`);
      
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error creating event. Please try again.');
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEvent || !user) return;
    
    try {
      // Similar validation as add event
      if (!newEvent.title || !newEvent.dateStart || !newEvent.timeStart || !newEvent.location || !newEvent.description) {
        alert('Please fill in all required fields');
        return;
      }

      const startDate = new Date(`${newEvent.dateStart}T${newEvent.timeStart}`);
      let endDate = startDate;
      
      if (newEvent.dateEnd && newEvent.timeEnd) {
        endDate = new Date(`${newEvent.dateEnd}T${newEvent.timeEnd}`);
      } else if (newEvent.timeEnd) {
        endDate = new Date(`${newEvent.dateStart}T${newEvent.timeEnd}`);
      }

      if (endDate < startDate) {
        alert('End date/time must be after start date/time');
        return;
      }

      // Prepare update data with proper field handling
      const updateData: any = {
        title: newEvent.title.trim(),
        dateStart: Timestamp.fromDate(startDate),
        dateEnd: Timestamp.fromDate(endDate),
        timeStart: newEvent.timeStart,
        timeEnd: newEvent.timeEnd || newEvent.timeStart,
        location: newEvent.location.trim(),
        description: newEvent.description.trim(),
        details: newEvent.details.trim() || newEvent.description.trim(),
        category: newEvent.category || 'General',
        isPublic: newEvent.isPublic,
        registrationRequired: newEvent.registrationRequired,
        contactEmail: newEvent.contactEmail.trim() || user.email || '',
        updatedAt: Timestamp.now()
      };

      // Only add optional fields if they have values
      if (eventThumbnail) {
        updateData.thumbnailUrl = eventThumbnail;
      }
      
      if (newEvent.maxAttendees) {
        // Remove commas and parse the number properly
        const cleanNumber = newEvent.maxAttendees.replace(/[,\s]/g, '');
        const parsedNumber = parseInt(cleanNumber);
        console.log(`📊 Updating maxAttendees: "${newEvent.maxAttendees}" → "${cleanNumber}" → ${parsedNumber}`);
        if (parsedNumber > 0) {
          updateData.maxAttendees = parsedNumber;
        }
      }

      await updateDoc(doc(db, 'events', editingEvent.id!), updateData);

      // Reset form
      setEditingEvent(null);
      setShowAddEventForm(false);
      setNewEvent({
        title: '',
        dateStart: '',
        dateEnd: '',
        timeStart: '',
        timeEnd: '',
        location: '',
        description: '',
        details: '',
        category: '',
        isPublic: true,
        maxAttendees: '',
        registrationRequired: false,
        contactEmail: ''
      });
      
      loadAdminData();
      alert(`✅ Event "${newEvent.title}" updated successfully!`);
      
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the event "${title}"?`)) return;

    try {
      await deleteDoc(doc(db, 'events', eventId));
      alert(`✅ Event "${title}" deleted successfully!`);
      loadAdminData();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  };

  const handleEditEvent = (event: Event) => {
    console.log('🔧 Editing event:', event.title, 'Current maxAttendees:', event.maxAttendees);
    setEditingEvent(event);
    
    // Convert timestamps back to form format
    const startDate = event.dateStart.toDate();
    const endDate = event.dateEnd?.toDate() || startDate;
    
    setNewEvent({
      title: event.title,
      dateStart: startDate.toISOString().split('T')[0],
      dateEnd: endDate.toISOString().split('T')[0],
      timeStart: event.timeStart,
      timeEnd: event.timeEnd || '',
      location: event.location,
      description: event.description,
      details: event.details,
      category: event.category || '',
      isPublic: event.isPublic,
      maxAttendees: event.maxAttendees?.toString() || '',
      registrationRequired: event.registrationRequired,
      contactEmail: event.contactEmail || ''
    });
    
    // Load existing thumbnail
    setEventThumbnail(event.thumbnailUrl || null);
    
    setShowAddEventForm(true);
    console.log('✅ Edit form opened with maxAttendees field set to:', event.maxAttendees?.toString() || '');
  };

  // Project Management Functions
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      if (!newProject.title || !newProject.summary || !newProject.body) {
        alert('Please fill in all required fields (Title, Summary, Body)');
        return;
      }

      const projectData: any = {
        title: newProject.title.trim(),
        summary: newProject.summary.trim(),
        body: newProject.body.trim(),
        status: newProject.status,
        gallery: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Add cover image if uploaded
      if (projectCover) {
        projectData.coverUrl = projectCover;
      }

      const { addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'projects'), projectData);

      // Reset form
      setShowAddProjectForm(false);
      setNewProject({
        title: '',
        summary: '',
        body: '',
        status: 'planning' as ProjectStatus
      });
      setProjectCover(null);
      
      loadAdminData();
      alert(`✅ Project "${newProject.title}" created successfully!`);
      
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProject || !user) return;
    
    try {
      if (!newProject.title || !newProject.summary || !newProject.body) {
        alert('Please fill in all required fields');
        return;
      }

      const updateData: any = {
        title: newProject.title.trim(),
        summary: newProject.summary.trim(),
        body: newProject.body.trim(),
        status: newProject.status,
        updatedAt: Timestamp.now()
      };

      // Update cover image if changed
      if (projectCover) {
        updateData.coverUrl = projectCover;
      }

      await updateDoc(doc(db, 'projects', editingProject.id!), updateData);

      // Reset form
      setEditingProject(null);
      setShowAddProjectForm(false);
      setNewProject({
        title: '',
        summary: '',
        body: '',
        status: 'planning' as ProjectStatus
      });
      setProjectCover(null);
      
      loadAdminData();
      alert(`✅ Project "${newProject.title}" updated successfully!`);
      
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project. Please try again.');
    }
  };

  const handleEditProject = (project: Project) => {
    console.log('🔧 Editing project:', project.title);
    setEditingProject(project);
    
    setNewProject({
      title: project.title,
      summary: project.summary,
      body: project.body,
      status: project.status
    });
    
    // Load existing cover
    setProjectCover(project.coverUrl || null);
    
    setShowAddProjectForm(true);
    console.log('✅ Edit form opened for project:', project.title);
  };

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to delete the project "${projectTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'projects', projectId));
      loadAdminData();
      alert(`✅ Project "${projectTitle}" deleted successfully!`);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    }
  };

  const handleProjectCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploadingProjectCover(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setProjectCover(base64);
      setUploadingProjectCover(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setUploadingProjectCover(false);
    };
    reader.readAsDataURL(file);
  };


  // News Engine Functions
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Creating news post...', newNewsPost);
    
    if (!user) {
      alert('You must be logged in to create news posts');
      return;
    }

    if (creatingNews) {
      console.log('⏳ Already creating news post, please wait...');
      return;
    }

    setCreatingNews(true);
    
    try {
      if (!newNewsPost.title || !newNewsPost.summary || !newNewsPost.content) {
        alert('Please fill in all required fields (Title, Summary, Content)');
        return;
      }

      console.log('📝 Preparing news data...');
      const newsData: any = {
        title: newNewsPost.title.trim(),
        summary: newNewsPost.summary.trim(),
        content: newNewsPost.content.trim(),
        category: newNewsPost.category,
        status: newNewsPost.status,
        tags: newNewsPost.tags ? newNewsPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        isUrgent: newNewsPost.isUrgent,
        location: newNewsPost.location.trim() || undefined,
        author: user.uid,
        authorName: user.displayName || user.email || 'Admin',
        images: newsImages,
        videos: newsVideos,
        views: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Add featured image if uploaded
      if (newsFeaturedImage) {
        newsData.featuredImage = newsFeaturedImage;
        console.log('📸 Added featured image');
      }

      // Set published date if publishing
      if (newNewsPost.status === 'published') {
        newsData.publishedAt = Timestamp.now();
        console.log('📅 Set as published');
      }

      // Check total data size before saving
      const dataString = JSON.stringify(newsData);
      const dataSizeKB = new Blob([dataString]).size / 1024;
      
      console.log('💾 Saving to database...', {
        title: newsData.title,
        category: newsData.category,
        status: newsData.status,
        hasImages: newsImages.length,
        hasVideos: newsVideos.length,
        dataSizeKB: dataSizeKB.toFixed(1),
        userUID: user.uid,
        userEmail: user.email
      });

      // Warn if data is getting large
      if (dataSizeKB > 500) {
        console.warn(`⚠️ Large document size: ${dataSizeKB.toFixed(1)} KB. Consider using fewer/smaller media files.`);
      }

      // Firestore has a 1MB limit per document
      if (dataSizeKB > 1000) {
        throw new Error(`Document too large (${dataSizeKB.toFixed(1)} KB). Firestore limit is 1MB. Please reduce media file sizes or use fewer files.`);
      }

      // Test admin permissions first
      console.log('🔐 Testing admin permissions...');
      console.log('User claims:', user);
      
      const { addDoc } = await import('firebase/firestore');
      console.log('📝 Attempting to create document in news collection...');
      const docRef = await addDoc(collection(db, 'news'), newsData);
      
      console.log('✅ News post created with ID:', docRef.id);

      // Reset form
      resetNewsForm();
      
      // Reload admin data
      await loadAdminData();
      
      alert(`✅ News post "${newNewsPost.title}" created successfully!`);
      
    } catch (error) {
      console.error('❌ Error creating news post:', error);
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('permissions')) {
          alert('❌ Permission denied. Please make sure you have admin privileges.');
        } else if (error.message.includes('network')) {
          alert('❌ Network error. Please check your internet connection and try again.');
        } else {
          alert(`❌ Error creating news post: ${error.message}`);
        }
      } else {
        alert('❌ Unknown error creating news post. Please try again.');
      }
    } finally {
      setCreatingNews(false);
    }
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingNews || !user) return;
    
    try {
      if (!newNewsPost.title || !newNewsPost.summary || !newNewsPost.content) {
        alert('Please fill in all required fields');
        return;
      }

      const updateData: any = {
        title: newNewsPost.title.trim(),
        summary: newNewsPost.summary.trim(),
        content: newNewsPost.content.trim(),
        category: newNewsPost.category,
        status: newNewsPost.status,
        tags: newNewsPost.tags ? newNewsPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        isUrgent: newNewsPost.isUrgent,
        location: newNewsPost.location.trim() || undefined,
        images: newsImages,
        videos: newsVideos,
        updatedAt: Timestamp.now()
      };

      // Update featured image if changed
      if (newsFeaturedImage) {
        updateData.featuredImage = newsFeaturedImage;
      }

      // Set published date if publishing for first time
      if (newNewsPost.status === 'published' && editingNews.status !== 'published') {
        updateData.publishedAt = Timestamp.now();
      }

      await updateDoc(doc(db, 'news', editingNews.id!), updateData);

      // Reset form
      resetNewsForm();
      
      loadAdminData();
      alert(`✅ News post "${newNewsPost.title}" updated successfully!`);
      
    } catch (error) {
      console.error('Error updating news post:', error);
      alert('Error updating news post. Please try again.');
    }
  };

  const handleEditNews = (news: NewsPost) => {
    console.log('🔧 Editing news post:', news.title);
    setEditingNews(news);
    
    setNewNewsPost({
      title: news.title,
      summary: news.summary,
      content: news.content,
      category: news.category,
      status: news.status,
      tags: news.tags.join(', '),
      isUrgent: news.isUrgent,
      location: news.location || ''
    });
    
    // Load existing media
    setNewsFeaturedImage(news.featuredImage || null);
    setNewsImages(news.images || []);
    setNewsVideos(news.videos || []);
    
    setShowCreateNewsForm(true);
    console.log('✅ Edit form opened for news:', news.title);
  };

  const handleDeleteNews = async (newsId: string, newsTitle: string) => {
    if (!confirm(`Are you sure you want to delete the news post "${newsTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'news', newsId));
      loadAdminData();
      alert(`✅ News post "${newsTitle}" deleted successfully!`);
    } catch (error) {
      console.error('Error deleting news post:', error);
      alert('Error deleting news post. Please try again.');
    }
  };

  const resetNewsForm = () => {
    setShowCreateNewsForm(false);
    setEditingNews(null);
    setNewsFeaturedImage(null);
    setNewsImages([]);
    setNewsVideos([]);
    setCreatingNews(false);
    setUploadingNewsMedia(false);
    setNewNewsPost({
      title: '',
      summary: '',
      content: '',
      category: 'general' as NewsCategory,
      status: 'draft' as NewsStatus,
      tags: '',
      isUrgent: false,
      location: ''
    });
  };

  const handleNewsImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingNewsMedia(true);

    Array.from(files).forEach(async (file) => {
      try {
        // Check file size (max 20MB for images)
        if (file.size > 20 * 1024 * 1024) {
          alert(`Image "${file.name}" is too large. Max size is 20MB.`);
          return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          alert(`File "${file.name}" is not an image.`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          
          // If no featured image yet, make this the featured image
          if (!newsFeaturedImage) {
            setNewsFeaturedImage(base64);
          } else {
            // Add to additional images
            setNewsImages(prev => [...prev, base64]);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image:', error);
        alert(`Error processing "${file.name}".`);
      }
    });

    setTimeout(() => {
      setUploadingNewsMedia(false);
    }, 1000);
  };

  const handleNewsVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingNewsMedia(true);

    try {
      for (const file of Array.from(files)) {
        // Check file type only - NO SIZE LIMIT
        if (!file.type.startsWith('video/')) {
          alert(`File "${file.name}" is not a video.`);
          continue;
        }

        const fileSizeMB = file.size / 1024 / 1024;
        console.log(`📹 Uploading video to Firebase Storage: ${file.name} (${fileSizeMB.toFixed(1)} MB)`);

        try {
          // Upload to Firebase Storage (like YouTube/Facebook)
          const videoRef = ref(storage, `news-videos/${Date.now()}_${file.name}`);
          
          console.log(`⬆️ Starting upload to Firebase Storage...`);
          const uploadResult = await uploadBytes(videoRef, file);
          
          console.log(`✅ Upload complete, getting download URL...`);
          const downloadURL = await getDownloadURL(uploadResult.ref);
          
          // Store the Firebase Storage URL (not base64)
          const videoData = {
            url: downloadURL,
            name: file.name,
            size: file.size,
            type: file.type,
            storagePath: uploadResult.ref.fullPath
          };
          
          setNewsVideos(prev => [...prev, JSON.stringify(videoData)]);
          
          console.log(`🎉 Video "${file.name}" uploaded successfully to Firebase Storage!`);
          alert(`✅ Video "${file.name}" (${fileSizeMB.toFixed(1)} MB) uploaded successfully! It will play like YouTube.`);
          
        } catch (uploadError) {
          console.error('❌ Firebase Storage upload failed:', uploadError);
          
          // Fallback to base64 for smaller files
          if (fileSizeMB < 5) {
            console.log(`🔄 Fallback: Processing ${file.name} as base64...`);
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64 = e.target?.result as string;
              setNewsVideos(prev => [...prev, base64]);
              console.log(`✅ Video "${file.name}" processed as base64 fallback`);
            };
            reader.readAsDataURL(file);
          } else {
            alert(`❌ Failed to upload large video "${file.name}". Firebase Storage may not be configured.`);
          }
        }
      }
    } catch (error) {
      console.error('Error in video upload process:', error);
      alert('Error uploading videos. Please try again.');
    } finally {
      setUploadingNewsMedia(false);
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

      // Step 3: Create Firebase Auth account (Simple working method)
      if ((application as any).password) {
        try {
          console.log('Creating Firebase Auth account for approved member...');
          
          // Simple account creation without complex authentication switching
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            application.email, 
            (application as any).password
          );
          
          console.log('Member account created successfully:', userCredential.user.uid);
          
          // Update application with auth UID
          await updateDoc(doc(db, 'applications', applicationId), {
            authUID: userCredential.user.uid,
            accountCreated: true,
            accountCreatedAt: new Date(),
          });

          alert(`✅ SUCCESS! 
          
Application approved and account created for ${application.fullName}!

📧 Email: ${application.email}
🔐 Password: ${(application as any).password}
🆔 Account ID: ${userCredential.user.uid}

The member can now sign in using "Members Sign In" button.

⚠️ Note: Please sign out and sign back in as admin to continue managing.`);
          
          // Redirect admin to sign in page to restore admin session
          setTimeout(() => {
            window.location.href = '/auth/signin?redirect=/admin';
          }, 3000);
          
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

      // Send actual email notification to the applicant
      try {
        console.log('📧 Sending approval email to applicant...');
        
        const { sendEmailNotification } = await import('@/lib/simple-email');
        
        await sendEmailNotification({
          to: application.email,
          name: application.fullName,
          type: 'approval'
        });
        
        console.log('✅ Approval email notification processed');
      } catch (emailError) {
        console.error('❌ Failed to send approval email to applicant:', emailError);
      }

        loadAdminData();
      
      // Success notification for admin
      alert(`✅ Application approved for ${application.fullName}!\n\n📧 APPROVAL EMAIL SENT TO: ${application.email}\n🔐 Member can now sign in with their credentials.\n\n✉️ The applicant has been notified via email about their approval.`);
      
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
          // Note: Account creation should be done server-side to avoid logging admin out
          console.log('Account creation skipped for manual member addition - recommend using application approval process');
          
          // Account creation disabled to prevent admin logout
          console.log('Account creation skipped for manual member addition');

          alert(`✅ SUCCESS! 
          
Member added: ${newMember.fullName}!

📧 Email: ${newMember.email}
⚠️ Firebase Auth account not created to prevent admin logout

Use the application approval process for Firebase Auth account creation.`);
          
          // DO NOT redirect - keep admin in dashboard
          
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
      const application = applications.find(app => app.id === applicationId);
      if (!application) {
        alert('Application not found');
        return;
      }

      // Update application status
      await updateDoc(doc(db, 'applications', applicationId), {
        status: 'rejected',
        updatedAt: new Date(),
      });

      // Send actual email notification to the applicant
      try {
        console.log('📧 Sending rejection email to applicant...');
        
        const { sendEmailNotification } = await import('@/lib/simple-email');
        
        await sendEmailNotification({
          to: application.email,
          name: application.fullName,
          type: 'rejection'
        });
        
        console.log('✅ Rejection email notification processed');
      } catch (emailError) {
        console.error('❌ Failed to send rejection email to applicant:', emailError);
      }

      loadAdminData();
      
      // Success notification for admin
      alert(`❌ Application rejected for ${application.fullName}.\n\n📧 REJECTION EMAIL SENT TO: ${application.email}\n\n✉️ The applicant has been notified via email about the decision.`);
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

  const pendingApplications = filteredApplications.filter(app => app.status === 'pending');
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
                <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link href="/admin/roles">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Manage Admin Roles</span>
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link href="/profile/dashboard">
                    <Home className="w-4 h-4 mr-2" />
                    <span className="font-semibold">My Profile</span>
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
                <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link href="/admin/roles">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Manage Admin Roles</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="applications" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto gap-2 p-2 bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl shadow-lg">
              <TabsTrigger 
                value="applications" 
                className="relative text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 font-semibold rounded-lg transition-all duration-300 bg-white hover:bg-blue-50 hover:text-blue-700 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-xl transform hover:scale-105 data-[state=active]:scale-105"
              >
                <span className="flex items-center justify-center gap-1 sm:gap-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Applications</span>
                  <span className="sm:hidden">Apps</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="relative text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 font-semibold rounded-lg transition-all duration-300 bg-white hover:bg-green-50 hover:text-green-700 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-700 data-[state=active]:text-white data-[state=active]:shadow-xl transform hover:scale-105 data-[state=active]:scale-105"
              >
                <span className="flex items-center justify-center gap-1 sm:gap-2">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Documents</span>
                  <span className="sm:hidden">Docs</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="leadership" 
                className="relative text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 font-semibold rounded-lg transition-all duration-300 bg-white hover:bg-purple-50 hover:text-purple-700 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-xl transform hover:scale-105 data-[state=active]:scale-105"
              >
                <span className="flex items-center justify-center gap-1 sm:gap-2">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Leadership</span>
                  <span className="sm:hidden">Leaders</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="relative text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 font-semibold rounded-lg transition-all duration-300 bg-white hover:bg-orange-50 hover:text-orange-700 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-700 data-[state=active]:text-white data-[state=active]:shadow-xl transform hover:scale-105 data-[state=active]:scale-105"
              >
                <span className="flex items-center justify-center gap-1 sm:gap-2">
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Content</span>
                  <span className="sm:hidden">Content</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="finance" 
                className="relative text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 font-semibold rounded-lg transition-all duration-300 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white data-[state=active]:shadow-xl transform hover:scale-105 data-[state=active]:scale-105"
              >
                <span className="flex items-center justify-center gap-1 sm:gap-2">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Finance</span>
                  <span className="sm:hidden">Money</span>
                </span>
              </TabsTrigger>
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
                  {/* Search Applications */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search applications by name, email, chapter, or status..."
                        value={applicationSearch}
                        onChange={(e) => setApplicationSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
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
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Uploaded Documents</h3>
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search documents..."
                          value={documentSearch}
                          onChange={(e) => setDocumentSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((document) => (
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
                          <p>{documentSearch ? `No documents found matching "${documentSearch}"` : 'No documents uploaded yet'}</p>
                          <p className="text-sm">{documentSearch ? 'Try a different search term' : 'Upload your first document using the form above'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leadership Tab */}
            <TabsContent value="leadership" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Leadership Management
                  </CardTitle>
                  <CardDescription>
                    Assign and manage leadership positions for MDPU members.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Assign Member to Leadership Position */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Assign Leadership Position
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Member</label>
                        <select 
                          value={selectedMemberForLeadership}
                          onChange={(e) => setSelectedMemberForLeadership(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Choose a member...</option>
                          {members.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.fullName} ({member.chapter})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Leadership Position</label>
                        <select 
                          value={selectedPosition}
                          onChange={(e) => setSelectedPosition(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Choose a position...</option>
                          <optgroup label="Executive Committee">
                            <option value="Chairman">Chairman</option>
                            <option value="Vice President">Vice President</option>
                            <option value="Secretary General">Secretary General</option>
                            <option value="DP Secretary General">DP Secretary General</option>
                            <option value="Treasurer">Treasurer</option>
                          </optgroup>
                          <optgroup label="Board of Directors">
                            <option value="Board Member - Finance">Board Member - Finance</option>
                            <option value="Board Member - Projects">Board Member - Projects</option>
                            <option value="Board Member - Community Relations">Board Member - Community Relations</option>
                            <option value="Board Member - Youth Affairs">Board Member - Youth Affairs</option>
                          </optgroup>
                          <optgroup label="Chapter Leadership">
                            <option value="Chapter President - USA">Chapter President - USA</option>
                            <option value="Chapter President - Europe">Chapter President - Europe</option>
                            <option value="Chapter President - Canada">Chapter President - Canada</option>
                            <option value="Chapter President - Cameroon">Chapter President - Cameroon</option>
                          </optgroup>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          onClick={assignLeadership}
                          disabled={!selectedMemberForLeadership || !selectedPosition}
                          className="w-full"
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Assign Position
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Current Leadership Assignments */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Current Leadership
                    </h3>
                    
                    {/* Executive Committee */}
                    <div className="mb-6">
                      <h4 className="font-medium text-orange-700 mb-3">Executive Committee</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getCurrentLeaders('executive').map((leader) => (
                          <LeadershipCard 
                            key={leader.id} 
                            leader={leader} 
                            onRemove={() => removeLeadership(leader.id!)}
                          />
                        ))}
                        {getCurrentLeaders('executive').length === 0 && (
                          <p className="text-gray-500 col-span-2">No executive positions assigned</p>
                        )}
                      </div>
                    </div>

                    {/* Board of Directors */}
                    <div className="mb-6">
                      <h4 className="font-medium text-blue-700 mb-3">Board of Directors</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getCurrentLeaders('board').map((leader) => (
                          <LeadershipCard 
                            key={leader.id} 
                            leader={leader} 
                            onRemove={() => removeLeadership(leader.id!)}
                          />
                        ))}
                        {getCurrentLeaders('board').length === 0 && (
                          <p className="text-gray-500 col-span-2">No board positions assigned</p>
                        )}
                      </div>
                    </div>

                    {/* Chapter Leaders */}
                    <div className="mb-6">
                      <h4 className="font-medium text-green-700 mb-3">Chapter Leaders</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getCurrentLeaders('chapter').map((leader) => (
                          <LeadershipCard 
                            key={leader.id} 
                            leader={leader} 
                            onRemove={() => removeLeadership(leader.id!)}
                          />
                        ))}
                        {getCurrentLeaders('chapter').length === 0 && (
                          <p className="text-gray-500 col-span-2">No chapter positions assigned</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="flex flex-col space-y-6 xl:grid xl:grid-cols-2 xl:gap-6 xl:space-y-0">
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
                    {/* Search Members */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search members by name, email, chapter, or role..."
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

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
                      {filteredMembers.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          {memberSearch ? `No members found matching "${memberSearch}"` : 'No members found. Add members manually or approve applications.'}
                        </div>
                      ) : (
                        filteredMembers.map((member) => (
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
                      <Button size="sm" onClick={() => setShowAddProjectForm(true)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Project
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Search Projects */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search projects by title, summary, or status..."
                          value={projectSearch}
                          onChange={(e) => setProjectSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {filteredProjects.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          {projectSearch ? `No projects found matching "${projectSearch}"` : 'No projects found. Create your first project.'}
                        </div>
                      ) : (
                        filteredProjects.slice(0, 5).map((project) => (
                        <div key={project.id} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{project.title}</p>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditProject(project)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteProject(project.id!, project.title)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        ))
                      )}
                    </div>

                    {/* Add/Edit Project Form */}
                    {showAddProjectForm && (
                      <div className="border rounded-lg p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
                        <h4 className="font-semibold text-lg mb-4 text-green-900">
                          {editingProject ? '✏️ Edit Project' : '🚀 Create New Project'}
                        </h4>
                        
                        <form onSubmit={editingProject ? handleUpdateProject : handleAddProject} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Project Title */}
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Title *
                              </label>
                              <Input
                                type="text"
                                value={newProject.title}
                                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                placeholder="Enter project title"
                                required
                              />
                            </div>

                            {/* Project Status */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status *
                              </label>
                              <select 
                                value={newProject.status}
                                onChange={(e) => setNewProject({...newProject, status: e.target.value as ProjectStatus})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                              >
                                <option value="planning">Planning</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="on-hold">On Hold</option>
                              </select>
                            </div>

                            {/* Cover Image Upload */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cover Image
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleProjectCoverUpload}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                              {uploadingProjectCover && (
                                <p className="text-sm text-green-600 mt-1">Uploading...</p>
                              )}
                              {projectCover && (
                                <div className="mt-2">
                                  <img src={projectCover} alt="Cover preview" className="w-20 h-20 object-cover rounded" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Project Summary */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Project Summary *
                            </label>
                            <Textarea
                              value={newProject.summary}
                              onChange={(e) => setNewProject({...newProject, summary: e.target.value})}
                              placeholder="Brief summary of the project (2-3 sentences)"
                              rows={3}
                              required
                            />
                          </div>

                          {/* Project Body/Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Detailed Description *
                            </label>
                            <Textarea
                              value={newProject.body}
                              onChange={(e) => setNewProject({...newProject, body: e.target.value})}
                              placeholder="Detailed description of the project, goals, and objectives"
                              rows={6}
                              required
                            />
                          </div>

                          {/* Form Actions */}
                          <div className="flex gap-3 pt-4">
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                              {editingProject ? 'Update Project' : 'Create Project'}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setShowAddProjectForm(false);
                                setEditingProject(null);
                                setProjectCover(null);
                                setNewProject({
                                  title: '',
                                  summary: '',
                                  body: '',
                                  status: 'planning' as ProjectStatus
                                });
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Events Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-lg font-bold">📅 Events</span>
                      <Button size="sm" onClick={() => setShowAddEventForm(true)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Add Event</span>
                        <span className="sm:hidden">Add</span>
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Search Events */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search events by title, location, or details..."
                          value={eventSearch}
                          onChange={(e) => setEventSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Add/Edit Event Form */}
                    {showAddEventForm && (
                      <div className="border rounded-lg p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h4 className="font-semibold text-lg mb-4 text-blue-900">
                          {editingEvent ? '✏️ Edit Event' : '✨ Create Professional Event'}
                        </h4>
                        
                        <form onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent} className="space-y-4">
                          {/* Basic Event Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                Event Title *
                              </label>
                              <Input
                                type="text"
                                placeholder="e.g., Annual MDPU Gala Dinner"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                className="w-full"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                Event Category
                              </label>
                              <select 
                                value={newEvent.category}
                                onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select category...</option>
                                <option value="Community">Community Event</option>
                                <option value="Educational">Educational/Workshop</option>
                                <option value="Cultural">Cultural Celebration</option>
                                <option value="Fundraising">Fundraising Event</option>
                                <option value="Meeting">Official Meeting</option>
                                <option value="Social">Social Gathering</option>
                                <option value="Awards">Awards Ceremony</option>
                              </select>
                            </div>
                          </div>

                          {/* Event Thumbnail Upload */}
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Event Thumbnail (Recommended for public appeal)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                              {eventThumbnail ? (
                                <div className="flex items-center gap-4">
                                  <img 
                                    src={eventThumbnail} 
                                    alt="Event thumbnail" 
                                    className="w-24 h-16 object-cover rounded-lg border"
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-green-700">✅ Thumbnail uploaded successfully</p>
                                    <p className="text-xs text-gray-500">This image will appear on event cards</p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEventThumbnail(null)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                  <p className="text-sm font-medium mb-2">Upload Event Thumbnail</p>
                                  <p className="text-xs text-gray-500 mb-4">
                                    Professional event image that will attract attendees (JPG, PNG, max 5MB)
                                  </p>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleThumbnailUpload(file);
                                    }}
                                    className="hidden"
                                    id="thumbnail-upload"
                                  />
                                  <label
                                    htmlFor="thumbnail-upload"
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                                  >
                                    {uploadingThumbnail ? (
                                      <>
                                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Uploading...
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="w-4 h-4" />
                                        Choose Thumbnail
                                      </>
                                    )}
                                  </label>
                          </div>
                              )}
                            </div>
                          </div>

                          {/* Date and Time */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                Start Date *
                              </label>
                              <Input
                                type="date"
                                value={newEvent.dateStart}
                                onChange={(e) => setNewEvent({...newEvent, dateStart: e.target.value})}
                                min={new Date().toISOString().split('T')[0]}
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                Start Time *
                              </label>
                              <Input
                                type="time"
                                value={newEvent.timeStart}
                                onChange={(e) => setNewEvent({...newEvent, timeStart: e.target.value})}
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                End Date
                              </label>
                              <Input
                                type="date"
                                value={newEvent.dateEnd}
                                onChange={(e) => setNewEvent({...newEvent, dateEnd: e.target.value})}
                                min={newEvent.dateStart || new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                End Time
                              </label>
                              <Input
                                type="time"
                                value={newEvent.timeEnd}
                                onChange={(e) => setNewEvent({...newEvent, timeEnd: e.target.value})}
                              />
                            </div>
                          </div>

                          {/* Location and Contact */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                Location *
                              </label>
                              <Input
                                type="text"
                                placeholder="e.g., MDPU Community Center, Freetown"
                                value={newEvent.location}
                                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                Contact Email
                              </label>
                              <Input
                                type="email"
                                placeholder="events@mdpu.org"
                                value={newEvent.contactEmail}
                                onChange={(e) => setNewEvent({...newEvent, contactEmail: e.target.value})}
                              />
                            </div>
                          </div>

                          {/* Event Description */}
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Short Description * (For event cards)
                            </label>
                            <Textarea
                              placeholder="Brief, engaging description (1-2 sentences) that will appear on event cards..."
                              value={newEvent.description}
                              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                              rows={2}
                              maxLength={200}
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">{newEvent.description.length}/200 characters</p>
                          </div>

                          {/* Detailed Information */}
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Detailed Information (Full event details)
                            </label>
                            <Textarea
                              placeholder="Comprehensive event details, agenda, special guests, requirements, etc..."
                              value={newEvent.details}
                              onChange={(e) => setNewEvent({...newEvent, details: e.target.value})}
                              rows={4}
                            />
                          </div>

                          {/* Event Settings */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                Max Attendees
                              </label>
                              <Input
                                type="number"
                                placeholder="e.g., 100"
                                value={newEvent.maxAttendees}
                                onChange={(e) => setNewEvent({...newEvent, maxAttendees: e.target.value})}
                                min="1"
                              />
                            </div>
                            
                            <div className="flex items-center space-x-2 pt-6">
                              <input
                                type="checkbox"
                                id="registrationRequired"
                                checked={newEvent.registrationRequired}
                                onChange={(e) => setNewEvent({...newEvent, registrationRequired: e.target.checked})}
                                className="w-4 h-4"
                              />
                              <label htmlFor="registrationRequired" className="text-sm font-medium text-gray-700">
                                Registration Required
                              </label>
                            </div>
                            
                            <div className="flex items-center space-x-2 pt-6">
                              <input
                                type="checkbox"
                                id="isPublic"
                                checked={newEvent.isPublic}
                                onChange={(e) => setNewEvent({...newEvent, isPublic: e.target.checked})}
                                className="w-4 h-4"
                              />
                              <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                                Show on Public Events Page
                              </label>
                            </div>
                          </div>

                          {/* Professional Template Helper */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h5 className="font-medium text-yellow-800 mb-2">💡 Professional Event Template</h5>
                            <p className="text-sm text-yellow-700 mb-3">Use this template for professional event descriptions:</p>
                            <div className="bg-white p-3 rounded border text-xs font-mono text-gray-600">
                              <strong>Example Description:</strong><br/>
                              "Join us for an evening of celebration, networking, and community building at our annual gala dinner."<br/><br/>
                              <strong>Example Details:</strong><br/>
                              "🎉 MDPU Annual Gala Dinner 2024<br/>
                              📅 Date: [Date]<br/>
                              ⏰ Time: [Time]<br/>
                              📍 Location: [Venue]<br/><br/>
                              🌟 Highlights:<br/>
                              • Awards ceremony honoring outstanding members<br/>
                              • Cultural performances and entertainment<br/>
                              • Networking opportunities<br/>
                              • Traditional dinner and refreshments<br/><br/>
                              👔 Dress Code: Formal/Traditional attire<br/>
                              🎫 Registration: Required by [deadline]<br/>
                              📞 Contact: [email] for more information"
                            </div>
                          </div>

                          {/* Form Actions */}
                          <div className="flex gap-3 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                              {editingEvent ? 'Update Event' : 'Create Event'}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setShowAddEventForm(false);
                                setEditingEvent(null);
                                setEventThumbnail(null);
                                setNewEvent({
                                  title: '',
                                  dateStart: '',
                                  dateEnd: '',
                                  timeStart: '',
                                  timeEnd: '',
                                  location: '',
                                  description: '',
                                  details: '',
                                  category: '',
                                  isPublic: true,
                                  maxAttendees: '',
                                  registrationRequired: false,
                                  contactEmail: ''
                                });
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {filteredEvents.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          {eventSearch ? `No events found matching "${eventSearch}"` : 'No events found. Create your first event.'}
                        </div>
                      ) : (
                        filteredEvents.map((event) => (
                          <div key={event.id} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                              {/* Event thumbnail */}
                              {event.thumbnailUrl && (
                                <img 
                                  src={event.thumbnailUrl} 
                                  alt={event.title}
                                  className="w-full sm:w-16 h-24 sm:h-12 object-cover rounded-lg border sm:mr-4 flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 break-words">{event.title}</h4>
                                  {event.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {event.category}
                                    </Badge>
                                  )}
                                  {event.isPublic && (
                                    <Badge className="text-xs bg-green-100 text-green-700">
                                      Public
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{event.description}</p>
                                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1 whitespace-nowrap">
                                    <Calendar className="w-3 h-3" />
                                    <span className="hidden sm:inline">{formatDate(event.dateStart)}</span>
                                    <span className="sm:hidden">{formatDate(event.dateStart).split(',')[0]}</span>
                                    {event.timeStart && <span className="hidden sm:inline"> at {event.timeStart}</span>}
                                  </span>
                                  <span className="flex items-center gap-1 truncate max-w-32 sm:max-w-none">📍 {event.location}</span>
                                  {event.maxAttendees && (
                                    <span className="whitespace-nowrap">👥 Max: {event.maxAttendees.toLocaleString()}</span>
                                  )}
                                  {event.registrationRequired && (
                                    <span className="text-orange-600 whitespace-nowrap">🎫 <span className="hidden sm:inline">Registration Required</span><span className="sm:hidden">Reg Req</span></span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 w-full sm:w-auto sm:ml-4">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="w-full sm:w-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                  onClick={() => handleEditEvent(event)}
                                  title="Edit Event"
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">Edit</span>
                                  <span className="sm:hidden">Edit</span>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  onClick={() => handleDeleteEvent(event.id!, event.title)}
                                  title="Delete Event"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">Delete</span>
                                  <span className="sm:hidden">Del</span>
                                </Button>
                              </div>
                        </div>
                            <div className="text-xs text-gray-400 pt-2 border-t">
                              Created: {formatDate(event.createdAt)} • 
                              {event.updatedAt && ` Updated: ${formatDate(event.updatedAt)}`}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* News Engine */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-lg font-bold">📰 News Engine</span>
                      <Button size="sm" onClick={() => setShowCreateNewsForm(true)} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Create News Post</span>
                        <span className="sm:hidden">Create</span>
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Create/Edit News Form - MOVED TO TOP */}
                    {showCreateNewsForm && (
                      <div className="border rounded-lg p-4 sm:p-6 mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <h4 className="font-bold text-lg sm:text-xl text-purple-900 flex items-center">
                            {editingNews ? '✏️ Edit News Post' : '📰 Create New News Post'}
                          </h4>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setShowCreateNewsForm(false);
                              resetNewsForm();
                            }}
                            className="w-full sm:w-auto text-gray-600 hover:text-gray-800"
                          >
                            <X className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Close Form</span>
                            <span className="sm:hidden">Close</span>
                          </Button>
                        </div>
                        
                        <form onSubmit={editingNews ? handleUpdateNews : handleCreateNews} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* News Title */}
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                News Title *
                              </label>
                              <Input
                                type="text"
                                value={newNewsPost.title}
                                onChange={(e) => setNewNewsPost({...newNewsPost, title: e.target.value})}
                                placeholder="Enter compelling news headline"
                                required
                                className="w-full"
                              />
                            </div>

                            {/* Category and Status */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                              </label>
                              <select
                                value={newNewsPost.category}
                                onChange={(e) => setNewNewsPost({...newNewsPost, category: e.target.value as NewsCategory})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                              >
                                <option value="">Select Category</option>
                                <option value="development">Development</option>
                                <option value="events">Events</option>
                                <option value="community">Community</option>
                                <option value="announcements">Announcements</option>
                                <option value="culture">Culture</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="education">Education</option>
                                <option value="health">Health</option>
                                <option value="agriculture">Agriculture</option>
                                <option value="general">General</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status *
                              </label>
                              <select
                                value={newNewsPost.status}
                                onChange={(e) => setNewNewsPost({...newNewsPost, status: e.target.value as NewsStatus})}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                              >
                                <option value="draft">Save as Draft</option>
                                <option value="published">Publish Immediately</option>
                              </select>
                            </div>

                            {/* Location and Tags */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location (Optional)
                              </label>
                              <Input
                                type="text"
                                value={newNewsPost.location || ''}
                                onChange={(e) => setNewNewsPost({...newNewsPost, location: e.target.value})}
                                placeholder="e.g., Mathamba Village, Tonkolili District, Sierra Leone"
                                className="w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (Optional)
                              </label>
                              <Input
                                type="text"
                                value={newNewsPost.tags}
                                onChange={(e) => setNewNewsPost({...newNewsPost, tags: e.target.value})}
                                placeholder="development, progress, community"
                                className="w-full"
                              />
                            </div>

                            {/* Urgent News Checkbox */}
                            <div className="sm:col-span-2">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newNewsPost.isUrgent || false}
                                  onChange={(e) => setNewNewsPost({...newNewsPost, isUrgent: e.target.checked})}
                                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  🚨 Mark as Urgent News
                                </span>
                              </label>
                            </div>
                          </div>

                          {/* News Summary */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              News Summary *
                            </label>
                            <Textarea
                              value={newNewsPost.summary}
                              onChange={(e) => setNewNewsPost({...newNewsPost, summary: e.target.value})}
                              placeholder="Brief summary for news cards and previews (2-3 sentences)"
                              required
                              rows={3}
                              className="w-full"
                            />
                          </div>

                          {/* Full News Content */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full News Content *
                            </label>
                            <Textarea
                              value={newNewsPost.content}
                              onChange={(e) => setNewNewsPost({...newNewsPost, content: e.target.value})}
                              placeholder="Write the complete news article here. Include all details, quotes, and information..."
                              required
                              rows={8}
                              className="w-full"
                            />
                          </div>

                          {/* Media Upload Section */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Upload Images */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Images
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleNewsImageUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                              />
                              <p className="text-xs text-gray-500 mt-1">Max 20MB per image, first image becomes featured</p>
                            </div>

                            {/* Upload Videos */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Videos
                              </label>
                              <input
                                type="file"
                                accept="video/*"
                                multiple
                                onChange={handleNewsVideoUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                              />
                              <p className="text-xs text-gray-500 mt-1">🔥 Upload any video size - powered by Firebase Storage (like YouTube)</p>
                            </div>
                          </div>

                          {/* Upload Progress */}
                          {uploadingNewsMedia && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                              <p className="text-purple-800 text-sm">📤 Processing media files...</p>
                            </div>
                          )}

                          {/* Media Preview */}
                          {(newsFeaturedImage || newsImages.length > 0 || newsVideos.length > 0) && (
                            <div className="border rounded-lg p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                              <h5 className="font-bold text-lg mb-4 text-gray-800">📱 Media Preview</h5>
                              
                              {/* Featured Image */}
                              {newsFeaturedImage && (
                                <div className="mb-6">
                                  <h6 className="font-semibold text-sm mb-2 text-purple-700">✨ Featured Image</h6>
                                  <div className="relative w-full h-32 rounded-lg overflow-hidden shadow-lg">
                                    <img src={newsFeaturedImage} alt="Featured" className="w-full h-full object-cover" />
                                    <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                                      ⭐ FEATURED
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Regular Images */}
                              {newsImages.length > 0 && (
                                <div className="mb-6">
                                  <h6 className="font-semibold text-sm mb-2 text-blue-700">🖼️ Images ({newsImages.length})</h6>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {newsImages.map((img, index) => (
                                      <div key={index} className="relative h-24 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                        <img src={img} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                                          <span className="text-white font-bold opacity-0 hover:opacity-100 transition-opacity">
                                            #{index + 1}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Videos Section */}
                              {newsVideos.length > 0 && (
                                <div>
                                  <h6 className="font-semibold text-lg mb-6 text-red-700 flex items-center">
                                    🎥 Professional Video Previews ({newsVideos.length})
                                    <span className="ml-3 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                      HD Quality
                                    </span>
                                  </h6>
                                  <div className="space-y-8">
                                    {newsVideos.map((video, index) => {
                                  // Check if it's Firebase Storage metadata or base64 data
                                  let videoSrc = video;
                                  let isStorageVideo = false;
                                  let fileName = `Video ${index + 1}`;
                                  let fileSize = '';
                                  
                                  try {
                                    const metadata = JSON.parse(video);
                                    if (metadata.url && metadata.name) {
                                      videoSrc = metadata.url;
                                      isStorageVideo = true;
                                      fileName = metadata.name;
                                      fileSize = metadata.size ? `${(metadata.size / 1024 / 1024).toFixed(1)} MB` : '';
                                    }
                                  } catch (e) {
                                    // It's regular base64 data
                                  }
                                  
                                      return (
                                        <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                                          {/* Video Header */}
                                          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                <h4 className="font-bold text-lg">🎥 {fileName}</h4>
                                                {fileSize && (
                                                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                                                    {fileSize}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="flex items-center space-x-2">
                                                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                                                  isStorageVideo ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                                                }`}>
                                                  {isStorageVideo ? '🔥 FIREBASE' : '📱 BASE64'}
                                                </span>
                                                <button
                                                  onClick={() => {
                                                    setNewsVideos(prev => prev.filter((_, i) => i !== index));
                                                  }}
                                                  className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center font-bold transition-colors"
                                                  title="Remove video"
                                                >
                                                  ×
                                                </button>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Large Video Preview */}
                                          <div className="p-4">
                                            <AdminVideoPreview
                                              src={videoSrc}
                                              videoName={fileName}
                                              index={index}
                                              className="h-96 w-full rounded-xl shadow-2xl"
                                            />
                                          </div>

                                          {/* Video Footer */}
                                          <div className="bg-gray-50 px-4 py-3 border-t">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center space-x-2">
                                                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                                                  isStorageVideo 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                  {isStorageVideo ? '☁️ Cloud Storage' : '💾 Embedded Data'}
                                                </span>
                                              </div>
                                              <div className="text-sm text-gray-600 font-medium">
                                                🎬 Click thumbnail to play video
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Form Actions */}
                          <div className="flex gap-3 pt-4">
                            <Button 
                              type="submit" 
                              className="bg-purple-600 hover:bg-purple-700"
                              disabled={creatingNews || uploadingNewsMedia}
                            >
                              {creatingNews ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Creating...
                                </>
                              ) : (
                                editingNews ? 'Update News Post' : 'Create News Post'
                              )}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={() => {
                                setShowCreateNewsForm(false);
                                resetNewsForm();
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Search News */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search news by title, content, category, tags, location..."
                          value={newsSearch}
                          onChange={(e) => setNewsSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {filteredNews.length === 0 ? (
                        <div className="text-center py-8">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">
                            {newsSearch ? `No news found matching "${newsSearch}"` : 'No news posts yet'}
                          </p>
                          <p className="text-sm text-gray-500">Create your first news post to share with the community</p>
                        </div>
                      ) : (
                        filteredNews.map((news) => (
                          <div key={news.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-sm sm:text-lg break-words">{news.title}</h3>
                                  {news.isUrgent && (
                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                      🚨 URGENT
                                    </span>
                                  )}
                                  <Badge className={`${
                                    news.status === 'published' ? 'bg-green-100 text-green-800' :
                                    news.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {news.status.toUpperCase()}
                                  </Badge>
                                </div>

                                {/* ADMIN VIDEO PREVIEW - MATCHING PUBLIC NEWS LAYOUT */}
                                {news.videos && news.videos.length > 0 && (
                                  <div className="mb-3">
                                    {(() => {
                                      const video = news.videos[0];
                                      let videoSrc = video;
                                      let videoName = 'Community Video';
                                      
                                      // Parse Firebase Storage metadata if present
                                      if (video.startsWith('{')) {
                                        try {
                                          const metadata = JSON.parse(video);
                                          if (metadata.url && metadata.name) {
                                            videoSrc = metadata.url;
                                            videoName = metadata.name;
                                          }
                                        } catch (e) {
                                          videoSrc = video;
                                        }
                                      }
                                      
                                      return (
                                        <AdminVideoPreview
                                          src={videoSrc}
                                          videoName={videoName}
                                          index={0}
                                          className="h-32 w-full"
                                        />
                                      );
                                    })()}
                                  </div>
                                )}
                                
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{news.summary}</p>
                                
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-gray-500">
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs whitespace-nowrap">
                                    📂 {news.category.toUpperCase()}
                                  </span>
                                  {news.location && (
                                    <span className="whitespace-nowrap truncate max-w-24 sm:max-w-none">📍 {news.location}</span>
                                  )}
                                  <span className="whitespace-nowrap">👁️ {news.views}</span>
                                  <span className="whitespace-nowrap truncate max-w-20 sm:max-w-none">✍️ {news.authorName}</span>
                                  {news.publishedAt && (
                                    <span className="whitespace-nowrap">📅 <span className="hidden sm:inline">{news.publishedAt.toDate().toLocaleDateString()}</span><span className="sm:hidden">{news.publishedAt.toDate().toLocaleDateString().split('/')[0]}/{news.publishedAt.toDate().toLocaleDateString().split('/')[2]}</span></span>
                                  )}
                                </div>
                                
                                {news.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {news.tags.slice(0, 2).map((tag, index) => (
                                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded whitespace-nowrap">
                                        #{tag}
                                      </span>
                                    ))}
                                    {news.tags.length > 2 && (
                                      <span className="text-xs text-gray-500 whitespace-nowrap">+{news.tags.length - 2}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              {news.featuredImage && (
                                <div className="w-full sm:w-auto sm:ml-4 mt-3 sm:mt-0">
                                  <img 
                                    src={news.featuredImage} 
                                    alt={news.title}
                                    className="w-full sm:w-20 h-16 sm:h-20 object-cover rounded-lg"
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-3 border-t">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="w-full sm:w-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                onClick={() => handleEditNews(news)}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                                <span className="sm:hidden">Edit</span>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                onClick={() => handleDeleteNews(news.id!, news.title)}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Delete</span>
                                <span className="sm:hidden">Del</span>
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Create/Edit News Form */}
                    {showCreateNewsForm && (
                      <div className="border rounded-lg p-6 mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 mt-6">
                        <h4 className="font-semibold text-lg mb-4 text-purple-900">
                          {editingNews ? '✏️ Edit News Post' : '📰 Create News Post'}
                        </h4>
                        
                        <form onSubmit={editingNews ? handleUpdateNews : handleCreateNews} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* News Title */}
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                News Title *
                              </label>
                              <Input
                                type="text"
                                value={newNewsPost.title}
                                onChange={(e) => setNewNewsPost({...newNewsPost, title: e.target.value})}
                                placeholder="Enter compelling news headline"
                                required
                              />
                            </div>

                            {/* Category & Status */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                              </label>
                              <select 
                                value={newNewsPost.category}
                                onChange={(e) => setNewNewsPost({...newNewsPost, category: e.target.value as NewsCategory})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                              >
                                <option value="general">General News</option>
                                <option value="development">Development & Progress</option>
                                <option value="events">Events & Activities</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="community">Community Affairs</option>
                                <option value="announcements">Official Announcements</option>
                                <option value="culture">Culture & Heritage</option>
                                <option value="education">Education</option>
                                <option value="health">Health & Wellness</option>
                                <option value="agriculture">Agriculture & Farming</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status *
                              </label>
                              <select 
                                value={newNewsPost.status}
                                onChange={(e) => setNewNewsPost({...newNewsPost, status: e.target.value as NewsStatus})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                              >
                                <option value="draft">Save as Draft</option>
                                <option value="published">Publish Immediately</option>
                              </select>
                            </div>

                            {/* Location & Tags */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location (Optional)
                              </label>
                              <Input
                                type="text"
                                value={newNewsPost.location}
                                onChange={(e) => setNewNewsPost({...newNewsPost, location: e.target.value})}
                                placeholder="e.g., Mathamba Village, Tonkolili"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (Optional)
                              </label>
                              <Input
                                type="text"
                                value={newNewsPost.tags}
                                onChange={(e) => setNewNewsPost({...newNewsPost, tags: e.target.value})}
                                placeholder="development, progress, community (comma separated)"
                              />
                            </div>
                          </div>

                          {/* Urgent Checkbox */}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="urgent"
                              checked={newNewsPost.isUrgent}
                              onChange={(e) => setNewNewsPost({...newNewsPost, isUrgent: e.target.checked})}
                              className="mr-2"
                            />
                            <label htmlFor="urgent" className="text-sm font-medium text-gray-700">
                              🚨 Mark as Urgent News
                            </label>
                          </div>

                          {/* Summary */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              News Summary *
                            </label>
                            <Textarea
                              value={newNewsPost.summary}
                              onChange={(e) => setNewNewsPost({...newNewsPost, summary: e.target.value})}
                              placeholder="Brief summary for news cards and previews (2-3 sentences)"
                              rows={3}
                              required
                            />
                          </div>

                          {/* Full Content */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full News Content *
                            </label>
                            <Textarea
                              value={newNewsPost.content}
                              onChange={(e) => setNewNewsPost({...newNewsPost, content: e.target.value})}
                              placeholder="Write the complete news article here. Include all details, quotes, and information..."
                              rows={8}
                              required
                            />
                          </div>

                          {/* Media Upload */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upload Images
                              </label>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleNewsImageUpload}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              <p className="text-xs text-gray-500 mt-1">Max 20MB per image, first image becomes featured</p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upload Videos
                              </label>
                              <input
                                type="file"
                                multiple
                                accept="video/*"
                                onChange={handleNewsVideoUpload}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              <p className="text-xs text-gray-500 mt-1">🔥 Upload any video size - powered by Firebase Storage (like YouTube)</p>
                            </div>
                          </div>

                          {uploadingNewsMedia && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                              <p className="text-purple-800 text-sm">📤 Processing media files...</p>
                            </div>
                          )}

                          {/* Media Preview */}
                          {(newsFeaturedImage || newsImages.length > 0 || newsVideos.length > 0) && (
                            <div className="border rounded-lg p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                              <h5 className="font-bold text-lg mb-4 text-gray-800">📱 Media Preview</h5>
                              
                              {/* Featured Image */}
                              {newsFeaturedImage && (
                                <div className="mb-6">
                                  <h6 className="font-semibold text-sm mb-2 text-purple-700">✨ Featured Image</h6>
                                  <div className="relative w-full h-32 rounded-lg overflow-hidden shadow-lg">
                                    <img src={newsFeaturedImage} alt="Featured" className="w-full h-full object-cover" />
                                    <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                                      ⭐ FEATURED
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Regular Images */}
                              {newsImages.length > 0 && (
                                <div className="mb-6">
                                  <h6 className="font-semibold text-sm mb-2 text-blue-700">🖼️ Images ({newsImages.length})</h6>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {newsImages.map((img, index) => (
                                      <div key={index} className="relative h-24 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                        <img src={img} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                                          <span className="text-white font-bold opacity-0 hover:opacity-100 transition-opacity">
                                            #{index + 1}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Videos Section */}
                              {newsVideos.length > 0 && (
                                <div>
                                  <h6 className="font-semibold text-lg mb-6 text-red-700 flex items-center">
                                    🎥 Professional Video Previews ({newsVideos.length})
                                    <span className="ml-3 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                      HD Quality
                                    </span>
                                  </h6>
                                  <div className="space-y-8">
                                    {newsVideos.map((video, index) => {
                                  // Check if it's Firebase Storage metadata or base64 data
                                  let videoSrc = video;
                                  let isStorageVideo = false;
                                  let fileName = `Video ${index + 1}`;
                                  let fileSize = '';
                                  
                                  try {
                                    const metadata = JSON.parse(video);
                                    if (metadata.url && metadata.name) {
                                      videoSrc = metadata.url;
                                      isStorageVideo = true;
                                      fileName = metadata.name;
                                      fileSize = metadata.size ? `${(metadata.size / 1024 / 1024).toFixed(1)} MB` : '';
                                    }
                                  } catch (e) {
                                    // It's regular base64 data
                                  }
                                  
                                      return (
                                        <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                                          {/* Video Header */}
                                          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                <h4 className="font-bold text-lg">🎥 {fileName}</h4>
                                                {fileSize && (
                                                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                                                    {fileSize}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="flex items-center space-x-2">
                                                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                                                  isStorageVideo ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                                                }`}>
                                                  {isStorageVideo ? '🔥 FIREBASE' : '📱 BASE64'}
                                                </span>
                                                <button
                                                  onClick={() => {
                                                    setNewsVideos(prev => prev.filter((_, i) => i !== index));
                                                  }}
                                                  className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center font-bold transition-colors"
                                                  title="Remove video"
                                                >
                                                  ×
                                                </button>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Large Video Preview */}
                                          <div className="p-4">
                                            <AdminVideoPreview
                                              src={videoSrc}
                                              videoName={fileName}
                                              index={index}
                                              className="h-96 w-full rounded-xl shadow-2xl"
                                            />
                                          </div>

                                          {/* Video Footer */}
                                          <div className="bg-gray-50 px-4 py-3 border-t">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center space-x-2">
                                                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                                                  isStorageVideo 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                  {isStorageVideo ? '☁️ Cloud Storage' : '💾 Embedded Data'}
                                                </span>
                                              </div>
                                              <div className="text-sm text-gray-600 font-medium">
                                                🎬 Click thumbnail to play video
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Form Actions */}
                          <div className="flex gap-3 pt-4">
                            <Button 
                              type="submit" 
                              className="bg-purple-600 hover:bg-purple-700"
                              disabled={creatingNews || uploadingNewsMedia}
                            >
                              {creatingNews ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Creating...
                                </>
                              ) : (
                                editingNews ? 'Update News Post' : 'Create News Post'
                              )}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={resetNewsForm}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
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
