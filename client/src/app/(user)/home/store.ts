import { create } from "zustand";

type HomeStore = {
  // 0h - 24h đại diện cho 0 - 48 (30p là 1)
  timeRange: [number, number];
  setTimeRange: (timeRange: [number, number]) => void;
};

export const useHomeStore = create<HomeStore>()((set, get) => ({
  timeRange: [0, 48],
  setTimeRange: (timeRange) => set({ timeRange }),
}));
