"use client";
import TripTable from "@/app/admin/trip/components/trip-table";
import { cn } from "@/lib/utils";
import { Bus } from "@/types/bus.type";
import { PaginationMeta } from "@/types/pagination.type";
import { Route } from "@/types/route.type";
import { Trip, TripSearchParams } from "@/types/trip.type";
import { faBusSide } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useTripStore } from "@/app/admin/trip/store";
import { Station } from "@/types/station.type";
import SearchContainer from "@/app/admin/trip/components/search-container";
import SearchDisplay from "@/app/admin/trip/components/search-display";
import SaveDelivery from "@/app/admin/trip/components/save-delivery";

interface TripContainerProps {
  params: TripSearchParams;
  trips: Trip[];
  pageMeta: PaginationMeta;
  busList: Bus[];
  routes: Route[];
  stations: Station[];
}
export default function TripContainer({
  params,
  trips,
  pageMeta,
  busList,
  routes,
  stations,
}: TripContainerProps) {
  const { setStations, setPageMeta } = useTripStore();
  useEffect(() => {
    setStations(stations);
    setPageMeta(pageMeta);
  }, [stations, setStations]);

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        <div
          className={cn(
            "flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center",
            "bg-white rounded-md p-3 px-6"
          )}
        >
          <div className="hidden sm:flex items-center gap-2">
            <FontAwesomeIcon icon={faBusSide} size="lg" className="w-5 h-5" />
            <p className="tracking-wider text-xl leading-none">Chuyến xe</p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              // onClick={() => handleOpen()}
              className="px-4 h-10 leading-none text-sm font-medium bg-black text-white rounded-md cursor-pointer"
            >
              Thêm mới
            </button>
            <SearchContainer
              busList={busList}
              params={params}
              routes={routes}
            />
          </div>
        </div>
        <SearchDisplay params={params} busList={busList} routes={routes} />
        {trips.length !== 0 && <TripTable trips={trips} />}
        {trips.length === 0 && (
          <div className="flex items-center justify-center h-20">
            <p>Không có dữ liệu</p>
          </div>
        )}
        <SaveDelivery stations={stations} />
      </div>
    </div>
  );
}
