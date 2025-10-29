import { TripSearchParams } from "@/types/trip.type";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import {
  faBus,
  faCalendar,
  faFilter,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Combobox from "@/components/combobox";
import { BusType } from "@/enums/bus.enum";
import { Bus } from "@/types/bus.type";
import { Route } from "@/types/route.type";

interface SearchContainerProps {
  params: TripSearchParams;
  busList: Bus[];
  routes: Route[];
}
export default function SearchContainer({
  params,
  busList,
  routes,
}: SearchContainerProps) {
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-pointer w-10 h-10 flex items-center justify-center border rounded-md bg-gray-300 ">
          <FontAwesomeIcon icon={faFilter} size="lg" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-sm leading-none">Ngày khởi hành</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="dates"
                className="w-full justify-between font-normal text-base"
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
                  const baseParams = getBaseParams(
                    "startDate",
                    "endDate",
                    "pageNumber"
                  );
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
        </div>
        <div className="space-y-2">
          <p className="text-sm leading-none">Xe khách</p>
          <Combobox
            options={busList.map((bus) => ({
              label: `${bus.licensePlate}, ${busTypeMap[bus.type]}`,
              value: bus.id,
            }))}
            className="w-full"
            placeholder="Chọn xe"
            type="default"
            value={params.busId}
            icon={
              <FontAwesomeIcon icon={faBus} size="lg" className="w-5 h-5" />
            }
            onChange={(busId) => {
              let newQuery = "";
              const baseParams = getBaseParams("busId", "pageNumber");
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
        </div>
        <div className="space-y-2">
          <p className="text-sm leading-none">Tuyến đường</p>
          <Combobox
            options={routes.map((route) => ({
              label: route.name,
              value: route.id,
            }))}
            className="w-full"
            placeholder="Chọn chuyến"
            type="default"
            value={params.routeId}
            icon={
              <FontAwesomeIcon icon={faRoute} size="lg" className="w-5 h-5" />
            }
            onChange={(routeId) => {
              let newQuery = "";
              const baseParams = getBaseParams("routeId", "pageNumber");
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
      </PopoverContent>
    </Popover>
  );
}
