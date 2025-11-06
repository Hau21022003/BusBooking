import { bookingApiRequest } from "@/api-requests/booking";
import BookingTable from "@/app/admin/services/booking/components/booking-table";
import PaginationContainer from "@/app/admin/services/booking/components/pagination-container";
import { BookingStatus, PaymentStatus } from "@/enums/booking.enum";
import { buildPaginatedMeta } from "@/lib/pagination";
import { FindAllSchema } from "@/schemas/booking.schema";
import React from "react";

interface BookingSearchParams {
  phone?: string;
  pageNumber?: string;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
}

interface BookingPageProps {
  searchParams: BookingSearchParams;
}
export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { bookingStatus, pageNumber, paymentStatus, phone } =
    await searchParams;

  const params: BookingSearchParams = {
    bookingStatus,
    pageNumber,
    paymentStatus,
    phone,
  };

  const parsed = FindAllSchema.safeParse({
    ...params,
    pageNumber: Number(pageNumber) || 1,
  });

  if (!parsed.success) {
    console.error(parsed.error.format());
    return <div>Invalid query params</div>;
  }

  const { data, total } = await bookingApiRequest
    .find(parsed.data)
    .then((res) => res.payload)
    .catch((e) => {
      console.log("bookingApiRequest error: ", e);
      return { data: [], total: 0 };
    });

  const pageMeta = buildPaginatedMeta({
    pageNumber: Number(pageNumber) || 1,
    pageSize: 10,
    total: total,
  });

  console.log("data", data);

  return (
    <div className="space-y-4">
      {/* <SearchContainer /> */}
      <BookingTable bookings={data} />
      <PaginationContainer pageMeta={pageMeta} />
    </div>
  );
}
