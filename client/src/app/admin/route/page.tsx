import { routeApiRequest } from "@/api-requests/route-api";
import { stationApiRequest } from "@/api-requests/station";
import RouteContainer from "@/app/admin/route/components/route-container";
import { Route } from "@/types/route.type";
import { Station } from "@/types/station.type";
import React from "react";

export default async function RoutePage() {
  let routeList: Route[] = [];
  try {
    routeList = (await routeApiRequest.find()).payload;
  } catch (error) {
    console.error(error);
  }
  let stations: Station[] = [];
  try {
    stations = (await stationApiRequest.find()).payload;
  } catch (error) {
    console.error(error);
  }
  return <RouteContainer routeList={routeList} stations={stations} />;
}
