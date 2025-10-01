import { TripSearchParams } from "@/types/trip.type";
import React from "react";

interface TripPageProps {
  searchParams: TripSearchParams;
}

export default async function TripPage({ searchParams }: TripPageProps) {
  const { busId } = await searchParams;
  console.log("searchParamsse", searchParams);
  return <div>page</div>;
}
