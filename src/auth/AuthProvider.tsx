import React from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export type AppRole =
  | 'super_admin'
  | 'admin_masjid'
  | 'panitia'
  | 'shohibul'
  | 'jagal'
  | 'supplier'
  | 'penerima';

export type Profile = {
  user_id: string;
  tenant_id: string | null;
  role: AppRole;
  full_name: string | null;
  phone: string | null;
  mosque_position?: string | null;
  address?: string | null;
  location_full?: string | null;
};

type AuthState = {
  session: Session | null;
  user: SupabaseUser | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthState | undefined>(undefined);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, tenant_id, role, full_name, phone, mosque_position, address, location_full')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return (data as Profile | null) ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refreshProfile = React.useCallback(async () => {
    if (!supabase.auth.getSession) return;
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (!currentUser) {
      setProfile(null);
      return;
    }
    const p = await fetchProfile(currentUser.id);
    setProfile(p);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        try {
          const p = await fetchProfile(data.session.user.id);
          if (!isMounted) return;
          setProfile(p);
        } catch {
          // profile might not exist yet
          if (!isMounted) return;
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        try {
          const p = await fetchProfile(nextSession.user.id);
          if (!isMounted) return;
          setProfile(p);
        } catch {
          if (!isMounted) return;
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value: AuthState = {
    session,
    user,
    profile,
    loading,
    refreshProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

