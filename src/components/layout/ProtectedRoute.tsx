import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a blank/loading screen while checking auth state with Supabase
  if (isAuthenticated === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: '20px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(79, 99, 61, 0.2)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};
