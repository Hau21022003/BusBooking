import { busApiRequest } from "@/api-requests/bus";
import { routeApiRequest } from "@/api-requests/route-api";
import { stationApiRequest } from "@/api-requests/station";
import { tripApiRequest } from "@/api-requests/trip";
import TripContainer from "@/app/admin/trip/trip-container";
import { buildPaginatedMeta } from "@/lib/pagination";
import { findAllSchema } from "@/schemas/trip.schema";
import { defaultPaginationMeta } from "@/types/pagination.type";
import { Trip, TripSearchParams } from "@/types/trip.type";
import React from "react";

interface TripPageProps {
  searchParams: TripSearchParams;
}

export default async function TripPage({ searchParams }: TripPageProps) {
  const { busId, endDate, pageNumber, routeId, startDate } = await searchParams;

  console.log("pageNumber", pageNumber);
  const params: TripSearchParams = {
    busId,
    endDate,
    pageNumber,
    routeId,
    startDate,
  };
  const parsed = findAllSchema.safeParse({
    ...params,
    pageNumber: Number(pageNumber) || 1,
  });

  if (!parsed.success) {
    console.error(parsed.error.format());
    return <div>Invalid query params</div>;
  }

  let trips: Trip[] = [];
  let pageMeta = defaultPaginationMeta;
  try {
    const { data, total } = (
      await tripApiRequest.findAll({
        ...params,
        pageNumber: Number(pageNumber) || 1,
      })
    ).payload;
    trips = data;
    pageMeta = buildPaginatedMeta({
      pageNumber: Number(pageNumber) || 1,
      pageSize: 10,
      total,
    });
  } catch (error) {
    console.log(error);
    return <div>Error</div>;
  }

  const [busListRes, routeListRes, stationsRes] = await Promise.allSettled([
    busApiRequest.find(),
    routeApiRequest.find(),
    stationApiRequest.find(),
  ]);

  const busList =
    busListRes.status === "fulfilled" ? busListRes.value.payload : [];
  const routes =
    routeListRes.status === "fulfilled" ? routeListRes.value.payload : [];
  const stations =
    stationsRes.status === "fulfilled" ? stationsRes.value.payload : [];

  return (
    <TripContainer
      params={params}
      trips={trips}
      busList={busList}
      pageMeta={pageMeta}
      routes={routes}
      stations={stations}
    />
  );
}
