import React, { useEffect, useState } from 'react';
import { ShopDashboard } from './ShopDashboard';
import { NgoDashboard } from './NgoDashboard';
import { MithraDashboard } from './MithraDashboard';
import { supabase } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage first for quick display
    const localRole = localStorage.getItem('userType');
    if (localRole) {
      setRole(localRole);
    }
    
    // Optionally fetch from supabase for source of truth
    const fetchRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (data?.role) {
          setRole(data.role);
          localStorage.setItem('userType', data.role); // sync
        }
      }
    };
    fetchRole();
  }, []);

  // Show a blank/loading state while fetching if no localRole is found
  if (role === null) return <div></div>;

  if (role === 'ngo') {
    return <NgoDashboard />;
  }

  if (role === 'mithra') {
    return <MithraDashboard />;
  }

  // Default to shop dashboard
  return <ShopDashboard />;
};
