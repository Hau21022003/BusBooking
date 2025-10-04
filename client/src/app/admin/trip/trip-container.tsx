"use client";
import TripTable from "@/app/admin/trip/components/trip-table";
import Combobox from "@/components/combobox";
import { Calendar } from "@/components/ui/calendar";
import { BusType } from "@/enums/bus.enum";
import { cn } from "@/lib/utils";
import { Bus } from "@/types/bus.type";
import { PaginationMeta } from "@/types/pagination.type";
import { Route } from "@/types/route.type";
import { Trip, TripSearchParams } from "@/types/trip.type";
import {
  faBus,
  faBusSide,
  faCalendar,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSaveDialog } from "@/hooks/use-save-dialog";
import { useTripStore } from "@/app/admin/trip/store";
import { Station } from "@/types/station.type";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateRange = {
    from: params.startDate ? new Date(params.startDate) : undefined,
    to: params.endDate ? new Date(params.endDate) : undefined,
  };
  const getBaseParams = (...excludes: (keyof TripSearchParams)[]) => {
    const query = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (!excludes.includes(key as keyof TripSearchParams)) {
        query.append(key, value);
      }
    });

    return query.toString();
  };

  const busTypeMap: Record<BusType, string> = {
    SEAT_16: "Xe 16 chỗ",
    LIMOUSINE_9: "Xe Limousine 9 chỗ",
    SEAT_29: "Xe 29 chỗ",
    SLEEPER_34: "Xe giường nằm 34 chỗ",
  };

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
            <p className="tracking-wider text-xl leading-none">Chuyến đi</p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="dates"
                  className="w-fit justify-between font-normal text-base"
                >
                  <div className="flex gap-2 items-center">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      size="lg"
                      className={cn(
                        "w-5 h-5",
                        !(dateRange?.from && dateRange?.to) && "opacity-50"
                      )}
                    />
                    {dateRange?.from && dateRange?.to
                      ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                      : "Select date"}
                  </div>
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="range"
                  selected={{
                    from: params.startDate
                      ? new Date(params.startDate)
                      : undefined,
                    to: params.endDate ? new Date(params.endDate) : undefined,
                  }}
                  captionLayout="dropdown"
                  onSelect={(range) => {
                    let newQuery = "";
                    const baseParams = getBaseParams("startDate", "endDate");
                    let newParams = "";
                    if (range) {
                      if (range.from) {
                        newParams = `startDate=${range.from.toISOString()}`;
                      }
                      if (range.to) {
                        newParams =
                          newParams !== ""
                            ? `${newParams}&endDate=${range.to.toISOString()}`
                            : `endDate=${range.to}`;
                      }
                      newQuery = baseParams
                        ? `${baseParams}&${newParams}`
                        : newParams;
                    } else {
                      newQuery = baseParams;
                    }
                    router.push(`?${newQuery}`);
                    router.refresh();
                  }}
                />
              </PopoverContent>
            </Popover>
            <Combobox
              options={busList.map((bus) => ({
                label: `${bus.licensePlate}, ${busTypeMap[bus.type]}`,
                value: bus.id,
              }))}
              className="w-40"
              placeholder="Chọn xe"
              type="default"
              value={params.busId}
              icon={
                <FontAwesomeIcon icon={faBus} size="lg" className="w-5 h-5" />
              }
              onChange={(busId) => {
                let newQuery = "";
                const baseParams = getBaseParams("busId");
                if (busId) {
                  newQuery = baseParams
                    ? `${baseParams}&busId=${busId}`
                    : `busId=${busId}`;
                } else {
                  newQuery = baseParams;
                }
                router.push(`?${newQuery}`);
              }}
            />
            <Combobox
              options={routes.map((route) => ({
                label: route.name,
                value: route.id,
              }))}
              className="w-40"
              placeholder="Chọn chuyến"
              type="default"
              value={params.routeId}
              icon={
                <FontAwesomeIcon icon={faRoute} size="lg" className="w-5 h-5" />
              }
              onChange={(routeId) => {
                let newQuery = "";
                const baseParams = getBaseParams("routeId");
                if (routeId) {
                  newQuery = baseParams
                    ? `${baseParams}&routeId=${routeId}`
                    : `routeId=${routeId}`;
                } else {
                  newQuery = baseParams;
                }
                router.push(`?${newQuery}`);
              }}
            />
          </div>
        </div>
        <TripTable trips={trips} />
      </div>
    </div>
  );
}
