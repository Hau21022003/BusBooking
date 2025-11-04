import { busApiRequest } from "@/api-requests/bus";
import { busModelApiRequest } from "@/api-requests/bus-model";
import BusPage from "@/app/admin/bus/list/bus-page";
import React from "react";

export default async function BusListPage() {
  const [busListRes, busModelsRes] = await Promise.allSettled([
    busApiRequest.find(),
    busModelApiRequest.findAll(),
  ]);
  const busList =
    busListRes.status === "fulfilled"
      ? busListRes.value.payload
      : (console.error("busListRes failed:", busListRes.reason), []);
  const busModelList =
    busModelsRes.status === "fulfilled"
      ? busModelsRes.value.payload
      : (console.error("busListRes failed:", busModelsRes.reason), []);

  return <BusPage busList={busList} busModelList={busModelList} />;
}
