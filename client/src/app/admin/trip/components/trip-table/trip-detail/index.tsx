import SaveBookingDialog from "@/app/admin/trip/components/trip-table/save-booking-dialog";
import SeatIcon, { SeatVariant } from "@/components/icon/seat-icon";
import SteeringWheelIcon from "@/components/icon/steering-wheel-icon";
import { PaymentStatus } from "@/enums/booking.enum";
import { SeatType } from "@/enums/bus.enum";
import { SeatStatus } from "@/enums/trip.enum";
import { cn } from "@/lib/utils";
import { SeatTrip, Trip } from "@/types/trip.type";
import React, { useState } from "react";
import BookingTable from "@/app/admin/trip/components/trip-table/trip-detail/booking-table";

interface TripDetailProps {
  trip: Trip;
}
export default function TripDetail({ trip }: TripDetailProps) {
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [tripInfo, setTripInfo] = useState<{
    id: number;
    seatTrip: SeatTrip;
  }>();
  const handleOpenDialog = (seat: SeatTrip) => {
    if (seat.status === SeatStatus.BOOKED) {
      return;
    }
    setOpenSaveDialog(true);
    setTripInfo({ id: trip.id, seatTrip: seat });
  };
  const handleCloseDialog = () => {
    setTripInfo(undefined);
    setOpenSaveDialog(false);
  };

  const seatVariantMap: Record<SeatType, SeatVariant> = {
    [SeatType.FRONT]: "front",
    [SeatType.MIDDLE]: "middle",
    [SeatType.BACK]: "back",
    [SeatType.STANDARD]: "default",
    [SeatType.VIP]: "vip",
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Mô hình xe */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-fit p-4 pt-7 bg-gray-100 border border-gray-300 rounded-t-3xl rounded-b-lg">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${trip.bus.seatLayout.cols}, minmax(0,1fr))`,
            }}
          >
            <div
              style={{ width: "50px", height: "50px" }}
              className="flex items-center justify-center p-2"
            >
              <SteeringWheelIcon />
            </div>
            {Array.from({
              length: trip.bus.seatLayout.rows,
            }).map((_, rowIndex) =>
              Array.from({
                length: trip.bus.seatLayout.cols,
              }).map((_, colIndex) => {
                const seats = trip.seats || [];
                const seat = seats.find(
                  (seat) => seat.row === rowIndex && seat.col === colIndex
                );
                const isPaidSeatBooking =
                  seat &&
                  !!trip.bookings?.findLast(
                    (booking) =>
                      booking.seat.col === seat.col &&
                      booking.seat.row === seat.row &&
                      booking.paymentStatus === PaymentStatus.PAID
                  );

                return (
                  (colIndex !== 0 || rowIndex !== 0) && (
                    <div key={`${rowIndex}-${colIndex}`}>
                      <div
                        className={cn(
                          "flex items-center justify-center",
                          seat && "cursor-pointer",
                          seat?.status === SeatStatus.BOOKED &&
                            "cursor-not-allowed"
                        )}
                        style={{
                          width: "50px",
                          height: "50px",
                        }}
                        onClick={() => {
                          if (seat) handleOpenDialog(seat);
                        }}
                      >
                        {seat && isPaidSeatBooking && (
                          <SeatIcon size={50} variant="disabled" />
                        )}
                        {seat && !isPaidSeatBooking && (
                          <SeatIcon
                            size={50}
                            variant={
                              seat.status === SeatStatus.AVAILABLE
                                ? seatVariantMap[seat.type]
                                : "selected"
                            }
                          />
                        )}
                      </div>
                    </div>
                  )
                );
              })
            )}
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-4 items-start md:flex-col">
          <div className="flex gap-2 items-center">
            <SeatIcon variant="selected" size={40} />
            <p className="text-black">Đã đặt vé</p>
          </div>
          <div className="flex gap-2 items-center">
            <SeatIcon variant="disabled" size={40} />
            <p className="text-black">Đã thanh toán</p>
          </div>
        </div>
      </div>
      <BookingTable bookings={trip.bookings} />
      {tripInfo && (
        <SaveBookingDialog
          onClose={handleCloseDialog}
          open={openSaveDialog}
          tripInfo={tripInfo}
        />
      )}
    </div>
  );
}
