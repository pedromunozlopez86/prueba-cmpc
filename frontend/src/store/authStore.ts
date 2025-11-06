import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      checkAuth: () => {
        const { token } = get();
        const isAuth = !!token;
        if (get().isAuthenticated !== isAuth) {
          set({ isAuthenticated: isAuth });
        }
        return isAuth;
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // Cuando se restaura desde localStorage, verificar el token
        if (state) {
          state.isAuthenticated = !!state.token;
        }
      },
    }
  )
);
