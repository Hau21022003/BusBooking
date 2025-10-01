import { busApiRequest } from "@/api-requests/bus";
import { routeApiRequest } from "@/api-requests/route-api";
import { scheduleApiRequest } from "@/api-requests/schedule";
import ScheduleContainer from "@/app/admin/schedule/schedule-container";
import { Bus } from "@/types/bus.type";
import { Route } from "@/types/route.type";
import { Schedule } from "@/types/schedule.type";
import React from "react";

export default async function SchedulePage() {
  let schedules: Schedule[] = [];
  try {
    schedules = (await scheduleApiRequest.find()).payload;
  } catch {
    console.error("SchedulePage: ", "Error fetch data");
  }

  let routes: Route[] = [];
  try {
    routes = (await routeApiRequest.find()).payload;
  } catch {
    console.error("SchedulePage: ", "Error fetch data");
  }

  let busList: Bus[] = [];
  try {
    busList = (await busApiRequest.find()).payload;
  } catch {
    console.error("SchedulePage: ", "Error fetch data");
  }

  return (
    <ScheduleContainer
      schedules={schedules}
      busList={busList}
      routes={routes}
    />
  );
}
