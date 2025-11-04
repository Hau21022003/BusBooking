import { tripApiRequest } from "@/api-requests/trip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SeatStatus, TripStatus } from "@/enums/trip.enum";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import { Trip } from "@/types/trip.type";
import {
  faAlarmClock,
  faCalendarCheck,
  faCalendarXmark,
  faCarOn,
  faX,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { Fragment } from "react";

interface UpdateStatusDialogProps {
  trip: Trip;
  open: boolean;
  onClose: () => void;
}
export default function UpdateStatusDialog({
  onClose,
  open,
  trip,
}: UpdateStatusDialogProps) {
  const router = useRouter();
  const updateTripStatus = async (status: TripStatus) => {
    try {
      await tripApiRequest.updateStatus(trip.id, status);
      onClose();
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col space-y-2">
        <DialogHeader>
          <DialogTitle>Chuyển trạng thái</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-[100px_1fr] gap-4">
            <p className="truncate text-gray-500">Tuyến</p>
            <p className="truncate">{trip.route.name}</p>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-4">
            <p className="truncate text-gray-500">Xe</p>
            <p className="truncate">
              {trip.bus.busModel?.name}, biển: {trip.bus.licensePlate}
            </p>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-4">
            <p className="truncate text-gray-500">Giờ khởi hành</p>
            <p className="truncate">
              {new Intl.DateTimeFormat("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(new Date(trip.departureTime))}
            </p>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-4">
            <p className="truncate text-gray-500">Ghế trống</p>
            <p className="truncate">
              {trip.seats.reduce((result, seat) => {
                if (seat.status === SeatStatus.AVAILABLE) return result + 1;
                else return result;
              }, 0)}{" "}
              chỗ
            </p>
          </div>
          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <p className="truncate text-gray-500">Trạng thái</p>
            <div>
              <div
                className={cn(
                  "px-3 py-2 w-fit rounded-sm",
                  "flex items-center gap-1 font-medium text-sm",
                  trip.status === TripStatus.SCHEDULED &&
                    "text-yellow-600 bg-yellow-100",
                  trip.status === TripStatus.COMPLETED &&
                    "text-green-600 bg-green-100",
                  trip.status === TripStatus.CANCELLED &&
                    "text-red-600 bg-red-100",
                  trip.status === TripStatus.RUNNING &&
                    "text-indigo-600 bg-indigo-100"
                )}
              >
                {trip.status === TripStatus.SCHEDULED && (
                  <Fragment>
                    <FontAwesomeIcon
                      size="lg"
                      icon={faAlarmClock}
                      className="w-5 h-5"
                    />
                    <p className="leading-none">Sắp lịch</p>
                  </Fragment>
                )}
                {trip.status === TripStatus.COMPLETED && (
                  <Fragment>
                    <FontAwesomeIcon
                      size="lg"
                      icon={faCalendarCheck}
                      className="w-5 h-5"
                    />
                    <p className="leading-none">Hoàn thành</p>
                  </Fragment>
                )}
                {trip.status === TripStatus.CANCELLED && (
                  <Fragment>
                    <FontAwesomeIcon
                      size="lg"
                      icon={faCalendarXmark}
                      className="w-5 h-5"
                    />
                    <p className="leading-none">Đã bị hủy</p>
                  </Fragment>
                )}
                {trip.status === TripStatus.RUNNING && (
                  <Fragment>
                    <FontAwesomeIcon
                      size="lg"
                      icon={faCarOn}
                      className="w-5 h-5"
                    />
                    <p className="leading-none">Đang chạy</p>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {trip.status === TripStatus.RUNNING && (
              <button
                onClick={() => updateTripStatus(TripStatus.COMPLETED)}
                className={cn(
                  "flex gap-2 items-center justify-center",
                  "cursor-pointer w-full sm:w-fit py-2 px-3",
                  "bg-green-100 rounded-md text-black"
                )}
              >
                <FontAwesomeIcon
                  size="lg"
                  icon={faCalendarCheck}
                  className="w-5 h-5"
                />
                <p className="leading-none font-medium text-sm">Hoàn thành</p>
              </button>
            )}
            {trip.status === TripStatus.SCHEDULED && (
              <button
                onClick={() => updateTripStatus(TripStatus.RUNNING)}
                className={cn(
                  "flex gap-2 items-center justify-center",
                  "cursor-pointer w-full sm:w-fit py-2 px-3",
                  "bg-indigo-100 rounded-md text-black"
                )}
              >
                <FontAwesomeIcon size="lg" icon={faCarOn} className="w-5 h-5" />
                <p className="leading-none font-medium text-sm">Xuất phát</p>
              </button>
            )}
            {trip.status !== TripStatus.CANCELLED &&
              trip.status !== TripStatus.COMPLETED && (
                <button
                  onClick={() => updateTripStatus(TripStatus.CANCELLED)}
                  className={cn(
                    "flex gap-2 items-center justify-center",
                    "cursor-pointer w-full sm:w-fit py-2 px-3",
                    "bg-red-100 rounded-md text-black"
                  )}
                >
                  <FontAwesomeIcon
                    size="lg"
                    icon={faXmark}
                    className="w-5 h-5"
                  />
                  <p className="leading-none font-medium text-sm">Hủy chuyến</p>
                </button>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
