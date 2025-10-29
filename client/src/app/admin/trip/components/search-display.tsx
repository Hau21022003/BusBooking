import { formatDateWithRelative } from "@/lib/time";
import { Bus } from "@/types/bus.type";
import { Route } from "@/types/route.type";
import { TripSearchParams } from "@/types/trip.type";
import {
  faBus,
  faCalendar,
  faRoute,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

interface SearchDisplayProps {
  params: TripSearchParams;
  busList: Bus[];
  routes: Route[];
}
export default function SearchDisplay({
  params,
  busList,
  routes,
}: SearchDisplayProps) {
  const searchParams = useSearchParams();
  const getBaseParams = (...excludes: (keyof TripSearchParams)[]) => {
    const query = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (!excludes.includes(key as keyof TripSearchParams)) {
        query.append(key, value);
      }
    });

    return query.toString();
  };

  const hasSearch = params.busId || params.routeId || params.startDate;

  return (
    hasSearch && (
      <div className="flex flex-wrap gap-3">
        {params.startDate && params.endDate && (
          <div className="px-2 h-10 flex items-center gap-2 rounded-md bg-gray-300">
            <FontAwesomeIcon icon={faCalendar} size="lg" className="w-5 h-5" />
            <p>
              {params.startDate === params.endDate
                ? formatDateWithRelative(params.startDate)
                : `${formatDateWithRelative(
                    params.startDate
                  )} - ${formatDateWithRelative(params.endDate)}`}
            </p>
            <Link
              href={`?${getBaseParams("pageNumber", "startDate", "endDate")}`}
              className="cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faXmark}
                size="lg"
                className="pl-2 w-4 h-4"
              />
            </Link>
          </div>
        )}
        {params.busId && (
          <div className="px-2 h-10 flex items-center gap-2 rounded-md bg-gray-300">
            <FontAwesomeIcon icon={faBus} size="lg" className="w-5 h-5" />
            <p>
              Biển{" "}
              {busList.find((bus) => bus.id === params.busId)?.licensePlate}
            </p>
            <Link
              href={`?${getBaseParams("pageNumber", "busId")}`}
              className="cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faXmark}
                size="lg"
                className="pl-2 w-4 h-4"
              />
            </Link>
          </div>
        )}

        {params.routeId && (
          <div className="px-2 h-10 flex items-center gap-2 rounded-md bg-gray-300">
            <FontAwesomeIcon icon={faRoute} size="lg" className="w-5 h-5" />
            <p>{routes.find((route) => route.id === params.routeId)?.name}</p>
            <Link
              href={`?${getBaseParams("pageNumber", "routeId")}`}
              className="cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faXmark}
                size="lg"
                className="pl-2 w-4 h-4"
              />
            </Link>
          </div>
        )}
      </div>
    )
  );
}
