import { routeApiRequest } from "@/api-requests/route-api";
import { stationApiRequest } from "@/api-requests/station";
import RouteContainer from "@/app/admin/route/components/route-container";
import React from "react";

export default async function RoutePage() {
  const [routeRes, stationRes] = await Promise.allSettled([
    routeApiRequest.find(),
    stationApiRequest.find(),
  ]);

  const routeList =
    routeRes.status === "fulfilled"
      ? routeRes.value.payload
      : (console.error("routeApiRequest failed:", routeRes.reason), []);

  const stations =
    stationRes.status === "fulfilled"
      ? stationRes.value.payload
      : (console.error("stationApiRequest failed:", stationRes.reason), []);

  return <RouteContainer routeList={routeList} stations={stations} />;
}
