'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Member } from '@/types/firestore';
import { LeadershipRoleCard } from "@/components/ui/custom/LeadershipRoleCard";

interface DynamicLeadershipProps {
  category: 'executive' | 'board' | 'chapter';
}

export function DynamicLeadership({ category }: DynamicLeadershipProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMembers = async () => {
    try {
      const membersQuery = query(collection(db, 'members'), orderBy('fullName'));
      const membersSnapshot = await getDocs(membersQuery);
      const allMembers = membersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as Member[];

      // Filter based on category
      let filteredMembers: Member[] = [];
      
      switch (category) {
        case 'executive':
          filteredMembers = allMembers.filter(member => 
            member.role && ['Chairman', 'Vice President', 'Secretary General', 'DP Secretary General', 'Treasurer'].includes(member.role)
          );
          break;
        case 'board':
          filteredMembers = allMembers.filter(member => 
            member.role && member.role.includes('Board Member')
          );
          break;
        case 'chapter':
          filteredMembers = allMembers.filter(member => 
            member.role && member.role.includes('Chapter President')
          );
          break;
      }

      setMembers(filteredMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
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

  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No {category} members found.</p>
        <p className="text-sm text-gray-500 mt-2">
          Leadership data will be populated by administrators.
        </p>
      </div>
    );
  }

  const gridCols = category === 'chapter' ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-8`}>
      {members.map((member) => (
        <LeadershipRoleCard 
          key={member.uid} 
          name={member.fullName}
          position={member.role || ''}
          image={member.image || member.avatarUrl}
          location={member.location || member.chapter}
          term={member.term}
          bio={member.bio}
        />
      ))}
    </div>
  );
}
