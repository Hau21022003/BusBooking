import { provinceApiRequest } from "@/api-requests/province";
import { stationApiRequest } from "@/api-requests/station";
import StationContainer from "@/app/admin/station/components/station-container";
import React from "react";

export default async function StationPage() {
  const [stationRes, provinceRes] = await Promise.allSettled([
    stationApiRequest.find(),
    provinceApiRequest.getProvinces(),
  ]);

  const stationList =
    stationRes.status === "fulfilled"
      ? stationRes.value.payload
      : (console.error("stationApiRequest failed:", stationRes.reason), []);

  const provinceList =
    provinceRes.status === "fulfilled"
      ? provinceRes.value.payload
      : (console.error("provinceApiRequest failed:", provinceRes.reason), []);

  return (
    <StationContainer stationList={stationList} provinceList={provinceList} />
  );
}
