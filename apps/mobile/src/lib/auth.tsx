import type { Session, User } from '@supabase/supabase-js';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { barrioUuid, oficioUuid } from '../constants/ids';
import { ApiError } from './api';
import { getSupabase, isSupabaseConfigured } from './supabase';

export type ProfileRole = 'seeker' | 'pro' | 'admin';

export type Profile = {
  id: string;
  role: ProfileRole;
  display_name: string | null;
  phone: string | null;
  home_barrio_id: string | null;
  avatar_url: string | null;
};

export type SignUpInput = {
  email: string;
  password: string;
  role: 'seeker' | 'pro';
  displayName: string;
  homeBarrioId?: string | null;
  oficioSlugs?: string[];
  barrioSlugs?: string[];
};

type AuthContextValue = {
  ready: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  refreshProfile: () => Promise<Profile | null>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<{ needsEmailConfirm: boolean }>;
  signOut: () => Promise<void>;
  ensureProfile: (opts?: {
    role?: ProfileRole;
    displayName?: string;
    homeBarrioId?: string | null;
  }) => Promise<Profile>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    role: (row.role as ProfileRole) || 'seeker',
    display_name: (row.display_name as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    home_barrio_id: (row.home_barrio_id as string | null) ?? null,
    avatar_url: (row.avatar_url as string | null) ?? null,
  };
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client
    .from('profiles')
    .select('id, role, display_name, phone, home_barrio_id, avatar_url')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.warn('[auth] profile fetch', error.message);
    return null;
  }
  return data ? mapProfile(data) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const refreshProfile = useCallback(async () => {
    const uid =
      session?.user?.id ??
      (await getSupabase()?.auth.getSession())?.data.session?.user?.id;
    if (!uid) {
      setProfile(null);
      return null;
    }
    const p = await fetchProfile(uid);
    setProfile(p);
    return p;
  }, [session?.user?.id]);

  useEffect(() => {
    let mounted = true;
    const client = getSupabase();
    if (!isSupabaseConfigured || !client) {
      setReady(true);
      return;
    }

    client.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      const uid = data.session?.user?.id;
      if (uid) {
        void fetchProfile(uid).then((p) => {
          if (mounted) setProfile(p);
        });
      }
      setReady(true);
    });

    const { data: sub } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (next?.user?.id) {
        void fetchProfile(next.user.id).then((p) => {
          if (mounted) setProfile(p);
        });
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const ensureProfile = useCallback(
    async (opts?: {
      role?: ProfileRole;
      displayName?: string;
      homeBarrioId?: string | null;
    }): Promise<Profile> => {
      const client = getSupabase();
      if (!client) {
        throw new ApiError('Supabase no configurado.', 'not_configured');
      }
      const {
        data: { session: s },
      } = await client.auth.getSession();
      if (!s?.user) {
        throw new ApiError('Debes iniciar sesión.', 'not_signed_in');
      }
      const existing = await fetchProfile(s.user.id);
      if (existing) {
        setProfile(existing);
        return existing;
      }
      const role = opts?.role ?? 'seeker';
      const displayName =
        opts?.displayName ??
        (s.user.user_metadata?.display_name as string | undefined) ??
        s.user.email?.split('@')[0] ??
        'Usuario';
      const homeBarrioId = opts?.homeBarrioId
        ? barrioUuid(opts.homeBarrioId)
        : null;
      const { data, error } = await client
        .from('profiles')
        .insert({
          id: s.user.id,
          role,
          display_name: displayName,
          home_barrio_id: homeBarrioId,
        })
        .select('id, role, display_name, phone, home_barrio_id, avatar_url')
        .single();
      if (error) {
        throw new ApiError(error.message || 'No se pudo crear el perfil', 'update_error');
      }
      if (role === 'pro') {
        await client.from('pro_profiles').upsert({ user_id: s.user.id }, { onConflict: 'user_id' });
      }
      const p = mapProfile(data);
      setProfile(p);
      return p;
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const client = getSupabase();
    if (!client) {
      throw new ApiError('Supabase no configurado.', 'not_configured');
    }
    const { error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      throw new ApiError(error.message || 'No se pudo iniciar sesión', 'invoke_error');
    }
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const client = getSupabase();
    if (!client) {
      throw new ApiError('Supabase no configurado.', 'not_configured');
    }
    const email = input.email.trim();
    const homeUuid = input.homeBarrioId
      ? barrioUuid(input.homeBarrioId)
      : input.barrioSlugs?.[0]
        ? barrioUuid(input.barrioSlugs[0])
        : null;

    const { data, error } = await client.auth.signUp({
      email,
      password: input.password,
      options: {
        data: {
          role: input.role,
          display_name: input.displayName.trim(),
        },
      },
    });
    if (error) {
      throw new ApiError(error.message || 'No se pudo registrar', 'invoke_error');
    }

    const uid = data.user?.id;
    const needsEmailConfirm = !data.session;
    if (!uid) {
      throw new ApiError('Registro incompleto — sin usuario.', 'invoke_error');
    }

    if (!data.session) {
      return { needsEmailConfirm: true };
    }

    const { error: profileErr } = await client.from('profiles').insert({
      id: uid,
      role: input.role,
      display_name: input.displayName.trim(),
      home_barrio_id: homeUuid,
    });
    if (profileErr && !profileErr.message.includes('duplicate')) {
      throw new ApiError(profileErr.message || 'No se pudo crear el perfil', 'update_error');
    }

    if (input.role === 'pro') {
      await client.from('pro_profiles').upsert({ user_id: uid }, { onConflict: 'user_id' });
      const oficios = input.oficioSlugs ?? [];
      if (oficios.length) {
        const rows = oficios.map((slug) => ({
          pro_id: uid,
          oficio_id: oficioUuid(slug),
        }));
        const { error: ofErr } = await client.from('pro_oficios').upsert(rows, {
          onConflict: 'pro_id,oficio_id',
        });
        if (ofErr) console.warn('[auth] pro_oficios', ofErr.message);
      }
      const barrios =
        input.barrioSlugs ?? (input.homeBarrioId ? [input.homeBarrioId] : []);
      if (barrios.length) {
        const rows = barrios.map((slug) => ({
          pro_id: uid,
          barrio_id: barrioUuid(slug),
          proof_status: 'none',
        }));
        const { error: bErr } = await client.from('pro_barrios').upsert(rows, {
          onConflict: 'pro_id,barrio_id',
        });
        if (bErr) console.warn('[auth] pro_barrios', bErr.message);
      }
    }

    const p = await fetchProfile(uid);
    setProfile(p);
    return { needsEmailConfirm };
  }, []);

  const signOut = useCallback(async () => {
    const client = getSupabase();
    if (!client) return;
    await client.auth.signOut();
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      session,
      user: session?.user ?? null,
      profile,
      refreshProfile,
      signIn,
      signUp,
      signOut,
      ensureProfile,
    }),
    [ready, session, profile, refreshProfile, signIn, signUp, signOut, ensureProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}

export function roleHomePath(role: ProfileRole | null | undefined): string {
  if (role === 'pro') return '/(pro)/inbox';
  if (role === 'admin') return '/admin';
  return '/(seeker)/descubre';
}
