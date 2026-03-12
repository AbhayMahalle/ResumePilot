import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
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
        api.setToken(token); // Update API client with the token
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
        api.setToken(token); // Ensure api knows token from cache

        try {
          const profile = await api.auth.getProfile();
          set({
            user: { id: profile.id, name: profile.name, email: profile.email },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          // Token might be expired or invalid
          logout();
          set({ 
            isLoading: false, 
            error: "Session expired. Please log in again." 
          });
        }
      },

      clearError: () => set({ error: null }),
      setError: (error: string) => set({ error }),
    }),
    {
      name: "resume-pilot-auth", // unique name for localStorage
      partialize: (state) => ({ token: state.token }), // Only persist the token
    }
  )
);
