import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type AppRole } from './AuthProvider';

export function RequireRole({
  allow,
  children,
}: {
  allow: AppRole[];
  children: React.ReactNode;
}) {
  const { profile, loading } = useAuth();

  if (loading) return null;
  if (!profile) return <Navigate to="/login" replace />;
  if (!allow.includes(profile.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

