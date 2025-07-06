import axios from "axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface userStore {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    fullName: string;
    bio: string;
    nativeLanguage: string;
    learningLanguage: string;
    location: string;
    isOnboard: boolean;
    profilePic: string;
  } | null;
  setUser: (user: userStore["user"], validUser: boolean) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const userAuthStore = create<userStore>()(
  devtools(
    persist(
      (set, get) => ({
        isAuthenticated: false,
        user: null,

        setUser: (user, validUser) => {
          set(() => ({
            user,
            isAuthenticated: validUser,
          }));
        },

        logout: () => {
          set({ isAuthenticated: false, user: null });
        },

        checkAuth: async () => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_ROOT_URL}/auth/verify`,
              { withCredentials: true }
            );

            console.log("Auth check response:", response.data); // Debug log

            if (!response.data.valid) {
              set({ isAuthenticated: false, user: null });
              return false;
            }

            // 🔥 FIX: Always use fresh user data from API response
            set({
              isAuthenticated: true,
              user: response.data.user, // Use API response user data
            });
            return true;
          } catch (error) {
            console.error("Auth check failed:", error); // Debug log
            set({ isAuthenticated: false, user: null });
            return false;
          }
        },
      }),
      {
        name: "user-auth-storage",
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
        }),
        // Add version for cache invalidation if needed
        version: 1,
      }
    ),
    { name: "user-auth-store" }
  )
);

export default userAuthStore;
