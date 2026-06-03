import { create } from "zustand";
import type { User } from "@/types/user";

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // true until initial auth check completes

  setAuth: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    }),

  setAccessToken: (accessToken) => set({ accessToken }),

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));

// Export getState for use in API interceptors (non-React context)
export const getState = useAuthStore.getState;
