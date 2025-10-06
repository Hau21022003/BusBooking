import { stationApiRequest } from "@/api-requests/station";
import { tripApiRequest } from "@/api-requests/trip";
import BookingForm from "@/app/(user)/bookingconfirmation/[tripId]/components/booking-form";
import React from "react";
interface BookingConfirmationPageProps {
  params: {
    tripId: string;
  };
}
export default async function BookingConfirmationPage({
  params,
}: BookingConfirmationPageProps) {
  const { tripId } = params;
  const trip = await tripApiRequest
    .findOne(Number(tripId))
    .then((res) => res.payload)
    .catch((e) => {
      console.log("Fetch trip error", e);
      return;
    });
  const stations = await stationApiRequest
    .find()
    .then((res) => res.payload)
    .catch((error) => {
      console.log(error);
      return [];
    });

  return (
    <div className="container max-w-[1200px] mx-auto px-6 py-6 space-y-6">
      {!trip && <p>Error</p>}
      {!!trip && <BookingForm trip={trip} stations={stations} />}
    </div>
  );
}
