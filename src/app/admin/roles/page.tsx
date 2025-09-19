'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHero } from '@/components/ui/custom/PageHero';
import { Section } from '@/components/ui/custom/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, refreshUserToken } from '@/lib/firebase';
import { Role, AdminInvite, AdminAudit } from '@/types/firestore';
import { 
  Users, 
  Shield, 
  ShieldCheck, 
  Plus,
  RefreshCw,
  Trash2,
  AlertCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function AdminRolesPage() {
  const { user, isSuperAdmin, loading } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [auditLog, setAuditLog] = useState<AdminAudit[]>([]);
  const [activeMembers, setActiveMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for direct role assignment
  const [selectedMemberEmail, setSelectedMemberEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'superadmin'>('admin');
  const [expiresAt, setExpiresAt] = useState('');
  
  // Form state for invite creation
  const [inviteEmail, setInviteEmail] = useState('');
  const [requiredApprovals, setRequiredApprovals] = useState(0);
  const [adminExpiresAt, setAdminExpiresAt] = useState('');

  // Callable functions
  const assignRoleFunction = httpsCallable(functions, 'assignRole');
  const refreshClaimsFunction = httpsCallable(functions, 'refreshClaims');
  const revokeRoleFunction = httpsCallable(functions, 'revokeRole');
  const createAdminInviteFunction = httpsCallable(functions, 'createAdminInvite');
  const approveInviteFunction = httpsCallable(functions, 'approveInvite');
  const extendAdminRoleFunction = httpsCallable(functions, 'extendAdminRole');

  useEffect(() => {
    if (user && isSuperAdmin && !loading) {
      loadAllData();
    }
  }, [user, isSuperAdmin, loading]);

  const loadAllData = async () => {
    try {
      // Load roles
      const rolesQuery = query(collection(db, 'roles'), orderBy('assignedAt', 'desc'));
      const rolesSnapshot = await getDocs(rolesQuery);
      const rolesData = rolesSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as Role[];
      setRoles(rolesData);

      // Load active members
      const membersQuery = query(collection(db, 'members'), orderBy('fullName'));
      const membersSnapshot = await getDocs(membersQuery);
      const membersData = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter out members who are already admins
      const adminEmails = rolesData.map(role => role.email.toLowerCase());
      const availableMembers = membersData.filter((member: any) => 
        (member.status === 'active' || !member.status) && // Include members without explicit status
        member.email && 
        !adminEmails.includes(member.email.toLowerCase())
      );
      setActiveMembers(availableMembers);

      // Load invites
      const invitesQuery = query(collection(db, 'adminInvites'), orderBy('createdAt', 'desc'));
      const invitesSnapshot = await getDocs(invitesQuery);
      const invitesData = invitesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminInvite[];
      setInvites(invitesData);

      // Load recent audit log
      const auditQuery = query(collection(db, 'adminAudit'), orderBy('timestamp', 'desc'), limit(50));
      const auditSnapshot = await getDocs(auditQuery);
      const auditData = auditSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminAudit[];
      setAuditLog(auditData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberEmail || !role) return;

    // Find the selected member details
    const selectedMember = activeMembers.find(member => member.email === selectedMemberEmail);
    if (!selectedMember) {
      toast({
        title: "Error",
        description: "Selected member not found",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await assignRoleFunction({
        email: selectedMemberEmail,
        role,
        expiresAt: expiresAt || null,
      });

      toast({
        title: "Success",
        description: `${role} role assigned to ${selectedMember.fullName} successfully!`,
      });

      // Reset form
      setSelectedMemberEmail('');
      setRole('admin');
      setExpiresAt('');

      // Reload roles
      await loadAllData();
    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      const result = await createAdminInviteFunction({
        email: inviteEmail || null,
        requiredApprovals,
        adminExpiresAt: adminExpiresAt || null,
      });

      toast({
        title: "Success",
        description: "Admin invite created successfully!",
      });

      // Copy claim URL to clipboard
      if (navigator.clipboard && result.data && typeof result.data === 'object' && 'claimUrl' in result.data) {
        await navigator.clipboard.writeText((result.data as any).claimUrl);
        toast({
          title: "Copied to Clipboard",
          description: "Invite link copied to clipboard",
        });
      }

      // Reset form
      setInviteEmail('');
      setRequiredApprovals(0);
      setAdminExpiresAt('');

      // Reload data
      await loadAllData();
    } catch (error: any) {
      console.error('Error creating invite:', error);
      
      let errorMessage = 'Failed to create invite';
      
      if (error.code === 'permission-denied') {
        errorMessage = "Only superadmins can create admin invites";
      } else if (error.code === 'failed-precondition') {
        if (error.message.includes('user not found')) {
          errorMessage = 'User account must exist in Firebase Auth first';
        } else {
          errorMessage = error.message;
        }
      } else if (error.code === 'deadline-exceeded') {
        errorMessage = 'Request timed out. Please try again';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Cannot Create Invite",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveInvite = async (inviteId: string) => {
    try {
      await approveInviteFunction({ inviteId });
      toast({
        title: "Success",
        description: "Invite approved successfully",
      });
      await loadAllData();
    } catch (error: any) {
      console.error('Error approving invite:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve invite",
        variant: "destructive",
      });
    }
  };

  const handleExtendRole = async (uid: string, email: string) => {
    const newExpiry = prompt(`Enter new expiry date for ${email} (YYYY-MM-DD):`);
    if (!newExpiry) return;

    try {
      await extendAdminRoleFunction({ uid, newExpiresAt: newExpiry });
      toast({
        title: "Success",
        description: `Role extended for ${email}`,
      });
      await loadAllData();
      
      // Force token refresh if extending current user
      if (user?.uid === uid) {
        await refreshUserToken();
      }
    } catch (error: any) {
      console.error('Error extending role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to extend role",
        variant: "destructive",
      });
    }
  };

  const handleRefreshClaims = async (uid: string) => {
    try {
      await refreshClaimsFunction({ uid });
      toast({
        title: "Success",
        description: "Claims refreshed successfully",
      });
      
      // Force token refresh for current user if it's them
      if (user?.uid === uid) {
        await refreshUserToken();
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error refreshing claims:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to refresh claims",
        variant: "destructive",
      });
    }
  };

  const handleRevokeRole = async (uid: string, email: string) => {
    if (!confirm(`Are you sure you want to revoke admin access for ${email}?`)) {
      return;
    }

    try {
      await revokeRoleFunction({ uid });
      toast({
        title: "Success",
        description: `Role revoked for ${email}`,
      });

      // Reload roles
      await loadAllData();
      
      // Force token refresh for current user if it's them
      if (user?.uid === uid) {
        await refreshUserToken();
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error revoking role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to revoke role",
        variant: "destructive",
      });
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

  const getStatusBadge = (role: Role) => {
    if (isExpired(role.expiresAt)) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (role.role === 'superadmin') {
      return <Badge className="bg-purple-100 text-purple-800">Super Admin</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Admin</Badge>;
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-forest mx-auto mb-4"></div>
          <p className="text-gray-600">Loading role management...</p>
        </div>
      </div>
    );
  }

  if (!user || !isSuperAdmin) {
    return (
      <>
        <PageHero
          title="Access Denied"
          subtitle="Super Admin Only"
          description="You don't have permission to manage admin roles."
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
                  Only super administrators can manage admin roles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/admin">Return to Admin Dashboard</Link>
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
        title="Admin Role Management"
        subtitle="Super Admin Dashboard"
        description="Manage admin roles and permissions for MDPU officers."
      />

      <Section>
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="roles" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="roles">Current Roles</TabsTrigger>
              <TabsTrigger value="assign">Assign Admin Role</TabsTrigger>
              <TabsTrigger value="invites">Active Invites</TabsTrigger>
              <TabsTrigger value="create">Create Invite</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>

            {/* Current Roles Tab */}
            <TabsContent value="roles">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Current Admin Roles
                  </CardTitle>
                  <CardDescription>
                    Manage active admin roles and their permissions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {roles.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No admin roles assigned</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {roles.map((roleData) => (
                        <div key={roleData.uid} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{roleData.email}</h3>
                                {getStatusBadge(roleData)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Assigned: {formatDate(roleData.assignedAt)}
                                </span>
                                {roleData.expiresAt && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Expires: {formatDate(roleData.expiresAt)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                UID: {roleData.uid}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleExtendRole(roleData.uid, roleData.email)}
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Calendar className="w-3 h-3" />
                                Extend
                              </Button>
                              <Button
                                onClick={() => handleRefreshClaims(roleData.uid)}
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Refresh
                              </Button>
                              <Button
                                onClick={() => handleRevokeRole(roleData.uid, roleData.email)}
                                size="sm"
                                variant="destructive"
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Revoke
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Active Invites Tab */}
            <TabsContent value="invites">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Active Admin Invites
                  </CardTitle>
                  <CardDescription>
                    Manage pending admin invites and approvals.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {invites.filter(invite => !invite.used && !isExpired(invite.expiresAt)).length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No active invites</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {invites.filter(invite => !invite.used && !isExpired(invite.expiresAt)).map((invite) => (
                        <div key={invite.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">
                                  {invite.email || 'Open Invite'}
                                </h3>
                                <Badge className="bg-blue-100 text-blue-800">
                                  {invite.role}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>Expires: {getTimeRemaining(invite.expiresAt)}</span>
                                <span>Approvals: {invite.approvals.length}/{invite.requiredApprovals}</span>
                                {invite.adminExpiresAt && (
                                  <span>Admin expires: {formatDate(invite.adminExpiresAt)}</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                Invite ID: {invite.id}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/admin/invite?id=${invite.id}`)}
                                size="sm"
                                variant="outline"
                              >
                                Copy Link
                              </Button>
                              {invite.approvals.length < invite.requiredApprovals && (
                                <Button
                                  onClick={() => handleApproveInvite(invite.id!)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Invite Tab */}
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Admin Invite
                  </CardTitle>
                  <CardDescription>
                    Create a secure admin invite link (1-hour expiry, single-use).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateInvite} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="inviteEmail">Email Address (Optional)</Label>
                      <Input
                        id="inviteEmail"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="admin@mdpu.org (leave empty for open invite)"
                      />
                      <p className="text-sm text-gray-500">
                        If specified, only this email can claim the invite
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requiredApprovals">Required Approvals</Label>
                      <Select value={requiredApprovals.toString()} onValueChange={(value) => setRequiredApprovals(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Immediate claim</SelectItem>
                          <SelectItem value="1">1 - Single approval required</SelectItem>
                          <SelectItem value="2">2 - Dual approval required</SelectItem>
                          <SelectItem value="3">3 - Triple approval required</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        Number of superadmin approvals needed before invite can be claimed
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminExpires">Admin Role Expiry (Optional)</Label>
                      <Input
                        id="adminExpires"
                        type="datetime-local"
                        value={adminExpiresAt}
                        onChange={(e) => setAdminExpiresAt(e.target.value)}
                      />
                      <p className="text-sm text-gray-500">
                        When the granted admin role will expire (leave empty for permanent)
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-yellow-800 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Important</span>
                      </div>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Invite links expire after exactly 1 hour</li>
                        <li>• Each invite can only be used once</li>
                        <li>• Link will be copied to clipboard automatically</li>
                      </ul>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Admin Invite'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Log Tab */}
            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Admin Audit Log
                  </CardTitle>
                  <CardDescription>
                    Recent admin actions and system events.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {auditLog.map((log) => (
                      <div key={log.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium capitalize">{log.action.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-600">
                            Actor: {log.actorUid} {log.targetUid && `→ Target: ${log.targetUid}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(log.timestamp)}
                          </p>
                        </div>
                        {log.meta && Object.keys(log.meta).length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {Object.keys(log.meta).length} details
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assign Role Tab (Existing) */}
            <TabsContent value="assign">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Assign Admin Role
                  </CardTitle>
                  <CardDescription>
                    Grant admin or super admin privileges to an existing active member.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAssignRole} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-select">Select Member</Label>
                      <Select value={selectedMemberEmail} onValueChange={setSelectedMemberEmail} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an active member to make admin" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeMembers.length === 0 ? (
                            <SelectItem value="" disabled>No available members</SelectItem>
                          ) : (
                            activeMembers.map((member) => (
                              <SelectItem key={member.id} value={member.email}>
                                {member.fullName} ({member.email}) - {member.chapter}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        Only active members who are not already admins are shown
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={role} onValueChange={(value: 'admin' | 'superadmin') => setRole(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="superadmin">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4" />
                              Super Admin
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        {role === 'admin' 
                          ? 'Can access admin dashboard and manage content' 
                          : 'Can manage admin roles and has full permissions'
                        }
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expires">Expiry Date (Optional)</Label>
                      <Input
                        id="expires"
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                      />
                      <p className="text-sm text-gray-500">
                        Leave empty for permanent role. Role will be automatically revoked after expiry.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Assigning...' : 'Assign Role'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </>
  );
}
