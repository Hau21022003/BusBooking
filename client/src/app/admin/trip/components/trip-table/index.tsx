"use client";
import { tripApiRequest } from "@/api-requests/trip";
import PaginationContainer from "@/app/admin/trip/components/trip-table/pagination-container";
import TripDetail from "@/app/admin/trip/components/trip-table/trip-detail";
import UpdateStatusDialog from "@/app/admin/trip/components/trip-table/update-status-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { busTypeMap } from "@/enums/bus.enum";
import { TripStatus } from "@/enums/trip.enum";
import { useSaveDialog } from "@/hooks/use-save-dialog";
import { handleErrorApi } from "@/lib/error";
import { extractTime, formatDateWithRelative } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Trip } from "@/types/trip.type";
import {
  faAlarmClock,
  faAngleDown,
  faAngleUp,
  faCalendarCheck,
  faCalendarXmark,
  faCarOn,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";

interface TripTableProps {
  trips: Trip[];
}
export default function TripTable({ trips }: TripTableProps) {
  const router = useRouter();
  const [selectedTripId, setSelectedTripId] = useState<number>();
  const { handleClose, handleOpen, open, selected } = useSaveDialog<Trip>();
  const deleteTrip = async (tripId: number) => {
    try {
      await tripApiRequest.delete(tripId);
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <div className="p-4 rounded-md bg-white">
      <Table className="text-gray-500 overflow-hidden border-collapse">
        <TableHeader>
          <TableRow className="">
            <TableHead className="font-medium text-gray-600 rounded-tl-md rounded-bl-md">
              Xe khách
            </TableHead>
            <TableHead className="font-medium text-gray-600  hidden sm:table-cell">
              Tuyến đường
            </TableHead>
            <TableHead className="font-medium text-gray-600 text-right hidden sm:table-cell">
              Giờ khởi hành
            </TableHead>
            <TableHead className="font-medium text-gray-600 hidden sm:table-cell">
              Trạng thái
            </TableHead>
            <TableHead className="font-medium text-gray-600 text-right rounded-tr-md rounded-br-md">
              Xử lý
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          {trips.map((trip) => (
            <Fragment key={trip.id}>
              <TableRow className={`py-4 border-b border-gray-200`}>
                <TableCell className="py-4 text-black">
                  {busTypeMap[trip.bus.type]}, biển: {trip.bus.licensePlate}
                </TableCell>
                <TableCell className="py-4 text-black">
                  {trip.route.name}
                </TableCell>
                <TableCell className="py-4 text-right text-black">
                  {extractTime(trip.departureTime)}
                  {", "}
                  {formatDateWithRelative(trip.departureTime)}
                </TableCell>
                <TableCell className="py-4 text-black">
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
                </TableCell>
                <TableCell className="py-4 text-black">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        if (selectedTripId === trip.id) {
                          setSelectedTripId(undefined);
                        } else {
                          setSelectedTripId(trip.id);
                        }
                      }}
                      className="cursor-pointer p-1"
                    >
                      <FontAwesomeIcon
                        icon={
                          selectedTripId === trip.id ? faAngleUp : faAngleDown
                        }
                        className="w-6 h-6"
                        size="lg"
                      />
                    </button>
                    {trip.status !== TripStatus.CANCELLED &&
                      trip.status !== TripStatus.COMPLETED && (
                        <button
                          onClick={() => handleOpen(trip)}
                          className="cursor-pointer p-1"
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="w-6 h-6"
                            size="lg"
                          />
                        </button>
                      )}
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="cursor-pointer"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="w-6 h-6"
                        size="lg"
                      />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
              {selectedTripId === trip.id && (
                <TableCell colSpan={5} className="bg-gray-50">
                  <TripDetail trip={trip} />
                </TableCell>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
      <PaginationContainer />
      {selected && (
        <UpdateStatusDialog onClose={handleClose} open={open} trip={selected} />
      )}
    </div>
  );
}
