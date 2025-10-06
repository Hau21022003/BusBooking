"use client";
import { bookingApiRequest } from "@/api-requests/booking";
import InfoContainer from "@/app/(user)/bookingconfirmation/[tripId]/components/info-container";
import TripInfo from "@/app/(user)/bookingconfirmation/[tripId]/components/trip-info";
import { Form } from "@/components/ui/form";
import { handleErrorApi } from "@/lib/error";
import {
  CreateBookingPublic,
  CreateBookingPublicSchema,
} from "@/schemas/booking.schema";
import { Station } from "@/types/station.type";
import { Trip } from "@/types/trip.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface BookingFormProps {
  trip: Trip;
  stations: Station[];
}
export default function BookingForm({ trip, stations }: BookingFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(CreateBookingPublicSchema),
    defaultValues: {
      tripId: trip.id,
    },
  });
  const saveBooking = async (data: CreateBookingPublic) => {
    try {
      await bookingApiRequest.createPublic(data);
      toast.success("Đặt vé thành công", { duration: 3000 });
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 3000);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col lg:flex-row items-start lg:gap-6 gap-4"
        onSubmit={form.handleSubmit(
          (data) => {
            saveBooking(data);
          },
          (errors) => {
            console.log("error", errors);
            if (errors.seat) {
              toast.error("Lỗi", {
                description: "Vui lòng chọn ghế đặt xe",
                duration: 3000,
              });
            }
          }
        )}
      >
        <div className="p-4 flex-1 bg-white w-full rounded-lg border border-gray-200">
          <TripInfo form={form} trip={trip} />
        </div>
        <div className="p-4 w-full lg:w-96 bg-white rounded-lg border border-gray-200">
          <InfoContainer form={form} stations={stations} />
        </div>
      </form>
    </Form>
  );
}
