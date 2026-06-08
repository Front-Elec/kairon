import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthRole = "admin" | "usuario";

export interface AuthSession {
  username: string;
  role: AuthRole;
}

interface AuthStore {
  session: AuthSession | null;
  hasHydrated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
  setHasHydrated: (value: boolean) => void;
}

const credentials: Record<
  string,
  {
    password: string;
    session: AuthSession;
  }
> = {
  "admin@kairon.com": {
    password: "admin123",
    session: {
      username: "admin",
      role: "admin",
    },
  },
  "usuario1@kairon.com": {
    password: "usuario123",
    session: {
      username: "Laura",
      role: "usuario",
    },
  },
  "usuario2@kairon.com": {
    password: "usuario123",
    session: {
      username: "Mateo",
      role: "usuario",
    },
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: null,
      hasHydrated: false,

      login: (username, password) => {
        const credential = credentials[username];

        if (!credential || credential.password !== password) {
          return false;
        }

        set({ session: credential.session });
        return true;
      },

      logout: () => {
        set({ session: null });
      },

      isAdmin: () => get().session?.role === "admin",
      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        session: state.session,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
