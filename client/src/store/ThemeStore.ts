import { create } from "zustand";

type Store = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<Store>((set) => ({
  theme: localStorage.getItem("Dev-Chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Dev-Chat-theme", theme);
    set({ theme });
  },
}));
