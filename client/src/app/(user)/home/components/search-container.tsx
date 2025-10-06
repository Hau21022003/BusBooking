"use client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Route } from "@/types/route.type";
import { faCalendar, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SearchContainerProps {
  routes: Route[];
}
export default function SearchContainer({ routes }: SearchContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = React.useState<Date>(new Date());
  const [openDateSelect, setOpenDateSelect] = useState(false);
  const [routeId, setRouteId] = useState<string | null>();
  const [openRouteId, setOpenRouteId] = useState(false);

  useEffect(() => {
    const rawDate = searchParams.get("date");
    if (rawDate) setDate(new Date(rawDate) || new Date());
    setRouteId(searchParams.get("routeId"));
  }, [searchParams]);

  const search = () => {
    if (!routeId || !date) return;
    const query = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "busType" && value !== undefined) {
        query.append(key, String(value));
      }
    });
    router.push(
      `?${query.toString()}&routeId=${routeId}&date=${date.toISOString()}`
    );
    router.refresh();
  };

  return (
    <div className="p-5 flex flex-col gap-4 lg:flex-row lg:items-stretch">
      <div
        className={cn(
          "flex-1 rounded-lg border border-gray-300",
          "flex gap-2 items-stretch"
        )}
      >
        <div className="flex-1">
          <Popover open={openRouteId} onOpenChange={setOpenRouteId}>
            <PopoverTrigger className="w-full h-full cursor-pointer">
              <div className="flex items-center justify-between gap-2 p-2 lg:p-4 border-l border-gray-200">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon size="xl" icon={faLocationDot} />
                  <div className="flex flex-col lg:flex-row lg:gap-2">
                    <p className="text-gray-500 text-start">Tuyến đường:</p>
                    <p>
                      {routeId
                        ? routes.findLast((route) => route.id === routeId)?.name
                        : "Chọn tuyến đường"}
                    </p>
                  </div>
                </div>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="sm:w-[var(--radix-popover-trigger-width)] w-auto overflow-hidden p-0">
              {routes.length !== 0 &&
                routes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => {
                      setRouteId(route.id);
                      setOpenRouteId(false);
                    }}
                    className="p-2 px-3 hover:bg-gray-50 cursor-pointer"
                  >
                    {route.name}
                  </div>
                ))}
              {routes.length === 0 && (
                <div className="p-5 flex items-center justify-center">
                  Tuyến đường rỗng
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        <Popover open={openDateSelect} onOpenChange={setOpenDateSelect}>
          <PopoverTrigger asChild className="cursor-pointer">
            <div className="flex items-center gap-2 p-2 lg:p-4 border-l border-gray-200">
              <FontAwesomeIcon size="xl" icon={faCalendar} />
              <div className="flex flex-col lg:flex-row lg:gap-2">
                <p className="text-gray-500">Ngày đi:</p>
                <p className="w-40 md:block hidden">
                  {date
                    ? new Intl.DateTimeFormat("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour12: false,
                      }).format(date)
                    : "Select date"}
                </p>
                <p className="md:hidden">
                  {date
                    ? new Intl.DateTimeFormat("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour12: false,
                      }).format(date)
                    : "Select date"}
                </p>
              </div>
              <p className="pl-4">
                <ChevronDownIcon className="w-4 h-4" />
              </p>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (date) setDate(date);
                setOpenDateSelect(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <button
        onClick={search}
        className="cursor-pointer p-4 px-8 flex justify-center items-center gap-2 rounded-lg bg-blue-500 text-white"
      >
        <p className="leading-none text-lg font-medium text-center">Tìm kiếm</p>
      </button>
    </div>
  );
}
