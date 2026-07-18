// ============================================================
// SiberCerdas – Auth Hook (wrapper around AuthContext)
// ============================================================
// Provides a simplified interface to the auth context.
// `profile` is an alias for `userProfile` for convenience.
// Both names are exported for consistency across the codebase.
// ============================================================

import { useAuth as useAuthContext } from '../contexts/AuthContext';
import type { UserProfile } from '../types';

interface AuthState {
  user: { uid: string } | null;
  profile: UserProfile | null;
  /** Alias for `profile` – matches the AuthContext field name */
  userProfile: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
}

export function useAuth(): AuthState {
  const ctx = useAuthContext();
  return {
    user: ctx.user,
    profile: ctx.userProfile,
    userProfile: ctx.userProfile,
    loading: ctx.loading,
    isDemo: ctx.isDemo,
  };
}
