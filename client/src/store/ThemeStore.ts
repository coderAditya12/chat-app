// import { create } from "zustand";

// type Store = {
//   theme: string;
//   setTheme: (theme: string) => void;
// };

// export const useThemeStore = create<Store>((set) => ({
//   // Use a default value during SSR, then hydrate with localStorage value
//   theme:
//     typeof window !== "undefined"
//       ? localStorage.getItem("Dev-Chat-theme") || "coffee"
//       : "coffee",

//   setTheme: (theme) => {
//     // Check if we're in the browser environment
//     if (typeof window !== "undefined") {
//       localStorage.setItem("Dev-Chat-theme", theme);
//     }
//     set({ theme });
//   },
// }));


// Create store without accessing localStorage
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "coffee", // default value
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "Dev-Chat-theme", 
    }
  )
);

