import { provinceApiRequest } from "@/api-requests/province";
import { stationApiRequest } from "@/api-requests/station";
import StationContainer from "@/app/admin/station/components/station-container";
import { Province } from "@/types/province.type";
import { Station } from "@/types/station.type";
import React from "react";

export default async function StationPage() {
  let stationList: Station[] = [];
  try {
    stationList = (await stationApiRequest.find()).payload;
  } catch (error) {
    console.error(error);
  }
  let provinceList: Province[] = [];
  try {
    provinceList = (await provinceApiRequest.getProvinces()).payload;
  } catch (error) {
    console.error(error);
  }
  return (
    <StationContainer stationList={stationList} provinceList={provinceList} />
  );
}
