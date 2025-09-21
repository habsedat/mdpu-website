'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Member, LeadershipAssignment } from '@/types/firestore';
import { LeadershipRoleCard } from "@/components/ui/custom/LeadershipRoleCard";

interface DynamicLeadershipProps {
  category: 'executive' | 'board' | 'chapter';
}

export function DynamicLeadership({ category }: DynamicLeadershipProps) {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeadership();
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadLeadership = async () => {
    try {
      console.log('Loading leadership for category:', category);
      
      // Load active leadership assignments - simplified query to avoid index issues
      const leadershipQuery = query(
        collection(db, 'leadership'), 
        where('isActive', '==', true)
      );
      const leadershipSnapshot = await getDocs(leadershipQuery);
      const leadershipData = leadershipSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeadershipAssignment[];
      
      console.log('Leadership assignments found:', leadershipData.length, leadershipData);

      // Load all members
      const membersQuery = query(collection(db, 'members'), orderBy('fullName'));
      const membersSnapshot = await getDocs(membersQuery);
      const membersData = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        uid: doc.data().uid || doc.id,
        ...doc.data()
      })) as Member[];
      
      console.log('Members found:', membersData.length);

      // Combine leadership assignments with member data and filter by category
      const leadersWithMemberData = leadershipData
        .map(assignment => {
          const member = membersData.find(m => m.id === assignment.memberId);
          if (!member) return null;
          
          const positionCategory = getPositionCategory(assignment.positionId);
          if (positionCategory !== category) return null;
          
          return {
            ...member,
            role: assignment.positionId,
            assignedAt: assignment.assignedAt
          };
        })
        .filter((leader): leader is NonNullable<typeof leader> => leader !== null)
        .sort((a, b) => getPositionOrder(a.role) - getPositionOrder(b.role));

      console.log(`Leaders for ${category} category:`, leadersWithMemberData);
      setLeaders(leadersWithMemberData);
    } catch (error) {
      console.error('Error loading leadership:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionCategory = (position: string) => {
    const executivePositions = ['Chairman', 'Vice President', 'Secretary General', 'DP Secretary General', 'Treasurer'];
    const boardPositions = ['Board Member - Finance', 'Board Member - Projects', 'Board Member - Community Relations', 'Board Member - Youth Affairs'];
    
    if (executivePositions.includes(position)) return 'executive';
    if (boardPositions.includes(position) || position.includes('Board Member')) return 'board';
    if (position.includes('Chapter President')) return 'chapter';
    return 'other';
  };

  const getPositionOrder = (position: string) => {
    const positionOrders: { [key: string]: number } = {
      'Chairman': 1,
      'Vice President': 2,
      'Secretary General': 3,
      'DP Secretary General': 4,
      'Treasurer': 5,
      'Board Member - Finance': 10,
      'Board Member - Projects': 11,
      'Board Member - Community Relations': 12,
      'Board Member - Youth Affairs': 13,
      'Chapter President - USA': 20,
      'Chapter President - Europe': 21,
      'Chapter President - Canada': 22,
      'Chapter President - Cameroon': 23,
    };
    return positionOrders[position] || 999;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (leaders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No {category} leadership positions assigned.</p>
        <p className="text-sm text-gray-500 mt-2">
          Leadership positions will be assigned by administrators.
        </p>
      </div>
    );
  }

  const gridCols = category === 'chapter' ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-8`}>
      {leaders.map((leader) => (
        <LeadershipRoleCard 
          key={leader.uid} 
          name={leader.fullName}
          position={leader.role || ''}
          image={leader.profilePictureURL || leader.image || leader.avatarUrl}
          location={leader.location || leader.chapter}
          term={leader.term}
          bio={leader.bio}
        />
      ))}
    </div>
  );
}
