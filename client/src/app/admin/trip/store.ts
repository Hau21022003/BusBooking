import { defaultPaginationMeta, PaginationMeta } from "@/types/pagination.type";
import { Station } from "@/types/station.type";
import { create } from "zustand";

type TripStore = {
  stations: Station[];
  setStations: (stations: Station[]) => void;
  pageMeta: PaginationMeta;
  setPageMeta: (pageMeta: PaginationMeta) => void;
};

export const useTripStore = create<TripStore>()((set, get) => ({
  stations: [],
  setStations: (stations) => set({ stations }),
  pageMeta: defaultPaginationMeta,
  setPageMeta: (pageMeta) => set({ pageMeta }),
}));
