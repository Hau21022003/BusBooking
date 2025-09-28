//page.tsx
import { busApiRequest } from "@/api-requests/bus";
import BusPage from "@/app/admin/bus-list/bus-page";
import { Bus } from "@/types/bus.type";
import React from "react";

export default async function BusListPage() {
  const fetchBusList = async () => {
    let busList: Bus[] = [];
    try {
      busList = (await busApiRequest.find()).payload;
    } catch (error) {
      console.error(error);
    }
    return busList;
  };
  const busList = await fetchBusList();
  return <BusPage busList={busList} />;
}
