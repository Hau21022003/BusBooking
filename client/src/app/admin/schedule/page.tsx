import { busApiRequest } from "@/api-requests/bus";
import { routeApiRequest } from "@/api-requests/route-api";
import { scheduleApiRequest } from "@/api-requests/schedule";
import ScheduleContainer from "@/app/admin/schedule/schedule-container";
import React from "react";

export default async function SchedulePage() {
  const [scheduleRes, routeRes, busRes] = await Promise.allSettled([
    scheduleApiRequest.find(),
    routeApiRequest.find(),
    busApiRequest.find(),
  ]);

  const schedules =
    scheduleRes.status === "fulfilled"
      ? scheduleRes.value.payload
      : (console.error(
          "SchedulePage: Error fetch schedules",
          scheduleRes.reason
        ),
        []);

  const routes =
    routeRes.status === "fulfilled"
      ? routeRes.value.payload
      : (console.error("SchedulePage: Error fetch routes", routeRes.reason),
        []);

  const busList =
    busRes.status === "fulfilled"
      ? busRes.value.payload
      : (console.error("SchedulePage: Error fetch buses", busRes.reason), []);

  return (
    <ScheduleContainer
      schedules={schedules}
      busList={busList}
      routes={routes}
    />
  );
}
