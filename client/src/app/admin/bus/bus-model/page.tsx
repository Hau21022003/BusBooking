import { busModelApiRequest } from "@/api-requests/bus-model";
import BusModelPageContainer from "@/app/admin/bus/bus-model/page-container";
import React from "react";

export default async function BusModelPage() {
  const busModelList = await busModelApiRequest
    .findAll()
    .then((res) => res.payload)
    .catch((err) => {
      console.error(err);
      return [];
    });
  return <BusModelPageContainer busModels={busModelList} />;
}
