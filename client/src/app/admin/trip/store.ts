import { Delivery } from "@/types/delivery.type";
import { defaultPaginationMeta, PaginationMeta } from "@/types/pagination.type";
import { Station } from "@/types/station.type";
import { Trip } from "@/types/trip.type";
import { create } from "zustand";

type TripStore = {
  stations: Station[];
  setStations: (stations: Station[]) => void;

  pageMeta: PaginationMeta;
  setPageMeta: (pageMeta: PaginationMeta) => void;

  isSaveDeliveryOpen: boolean;
  selectedDelivery?: Delivery;
  selectedTrip?: Trip;
  openSaveDelivery: (params: {
    trip?: Trip;
    selectedDelivery?: Delivery;
  }) => void;
  closeSaveDelivery: () => void;
};

export const useTripStore = create<TripStore>()((set, get) => ({
  stations: [],
  setStations: (stations) => set({ stations }),

  pageMeta: defaultPaginationMeta,
  setPageMeta: (pageMeta) => set({ pageMeta }),

  isSaveDeliveryOpen: false,
  selectedTripId: undefined,
  openSaveDelivery: ({ trip, selectedDelivery }) =>
    set({
      isSaveDeliveryOpen: true,
      selectedTrip: trip,
      selectedDelivery: selectedDelivery,
    }),
  closeSaveDelivery: () =>
    set({
      isSaveDeliveryOpen: false,
      selectedTrip: undefined,
      selectedDelivery: undefined,
    }),
}));
