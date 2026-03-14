import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  jobRole?: string;
  experienceLevel?: string;
  skills?: string[];
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  setError: (err: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: (token, user) => {
        set({ token, user, isAuthenticated: true, error: null });
        api.setToken(token);
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
        api.setToken(null);
      },

      fetchProfile: async () => {
        const { token, logout } = get();
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        set({ isLoading: true, error: null });
        api.setToken(token);

        try {
          const data = await api.auth.getProfile();
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          logout();
          set({
            isLoading: false,
            error: "Session expired. Please log in again.",
          });
        }
      },

      updateProfile: async (profileData) => {
        try {
          const data = await api.auth.updateProfile(profileData);
          set({ user: data.user });
        } catch (error: any) {
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      setError: (error: string) => set({ error }),
    }),
    {
      name: "resume-pilot-auth",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
