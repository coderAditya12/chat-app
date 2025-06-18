import { create } from "zustand";

type Store = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<Store>()((set) => ({
  theme: "coffee",
  setTheme: (theme) => set(() => ({ theme })),
}));
