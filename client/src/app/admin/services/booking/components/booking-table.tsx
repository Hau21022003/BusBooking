"use client";
import { Booking } from "@/types/booking.type";
import { bookingApiRequest } from "@/api-requests/booking";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingStatus, PaymentStatus } from "@/enums/booking.enum";
import { downloadFile } from "@/lib/download-file";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import {
  faBan,
  faBusSide,
  faCircleCheck,
  faClock,
  faMoneyBill,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface BookingTableProps {
  bookings: Booking[];
}
export default function BookingTable({ bookings }: BookingTableProps) {
  const router = useRouter();

  const downloadInvoice = async (bookingId: number) => {
    await toast.promise(bookingApiRequest.downloadInvoice(bookingId), {
      loading: "Đang tải hóa đơn...",
      success: (rsp) => {
        downloadFile(rsp.payload, `booking_${bookingId}.pdf`);
        return "Tải hóa đơn thành công!";
      },
      error: "Có lỗi xảy ra khi tải hóa đơn.",
    });
  };

  const cancelBooking = async (bookingId: number) => {
    try {
      await bookingApiRequest.cancelBooking(bookingId);
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const confirmBooking = async (bookingId: number) => {
    try {
      await bookingApiRequest.confirmBooking(bookingId);
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const updatePaymentStatus = async (bookingId: number) => {
    try {
      await bookingApiRequest.updatePaymentStatus(bookingId);
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <div className="border rounded-lg overflow-hidden border-gray-300 bg-white">
      <Table className="text-gray-500 overflow-hidden border-collapse">
        <TableHeader className="bg-gray-300">
          <TableRow className="border-b border-gray-300">
            <TableHead className="font-medium text-gray-700 pl-4 py-4 rounded-tl-md">
              Thông tin cá nhân
            </TableHead>
            <TableHead className="text-right font-medium text-gray-700 py-4">
              Giá vé
            </TableHead>
            <TableHead className="font-medium text-gray-700 py-4">
              Trạng thái
            </TableHead>
            <TableHead className="text-center font-medium text-gray-700 py-4">
              Thanh toán
            </TableHead>

            <TableHead className="font-medium text-gray-700 py-4 pr-4 text-right rounded-tr-md">
              Xử lý
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          {bookings.map((booking) => (
            <TableRow
              key={booking.id}
              className={`py-4 border-b border-gray-300 bg-white w-60 truncate`}
            >
              <TableCell className="py-4 pl-4 text-black">
                <p
                  className="w-80 truncate"
                  title={`Sđt: ${booking.phone}, Địa điểm: ${booking.pickupLocation}`}
                >
                  {booking.phone || booking.pickupLocation
                    ? `Sđt: ${booking.phone}, Địa điểm: ${booking.pickupLocation}`
                    : "Mua tại quầy"}
                </p>
              </TableCell>
              <TableCell className="py-4 text-black">
                <div className="flex gap-1 justify-end">
                  <p>{booking.price.toLocaleString("vi-VN")}</p>
                  <p className="text-gray-400">VNĐ</p>
                </div>
              </TableCell>
              <TableCell className="py-4 text-black">
                <div
                  className={cn(
                    "px-3 py-2 w-fit rounded-sm",
                    "flex items-center gap-1 font-medium text-sm",
                    booking.bookingStatus === BookingStatus.RESERVED &&
                      "text-yellow-600 bg-yellow-100",
                    booking.bookingStatus === BookingStatus.CONFIRMED &&
                      "text-green-600 bg-green-100",
                    booking.bookingStatus === BookingStatus.CANCELLED &&
                      "text-red-600 bg-red-100"
                  )}
                >
                  {booking.bookingStatus === BookingStatus.CONFIRMED && (
                    <Fragment>
                      <FontAwesomeIcon
                        size="lg"
                        icon={faCircleCheck}
                        className="w-5 h-5"
                      />
                      <p className="leading-none">Đã xác nhận</p>
                    </Fragment>
                  )}
                  {booking.bookingStatus === BookingStatus.RESERVED && (
                    <Fragment>
                      <FontAwesomeIcon
                        size="lg"
                        icon={faClock}
                        className="w-5 h-5"
                      />
                      <p className="leading-none">Chờ xác nhận</p>
                    </Fragment>
                  )}
                  {booking.bookingStatus === BookingStatus.CANCELLED && (
                    <Fragment>
                      <FontAwesomeIcon
                        size="lg"
                        icon={faBan}
                        className="w-5 h-5"
                      />
                      <p className="leading-none">Bị hủy</p>
                    </Fragment>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4 text-black">
                <div className="flex justify-center">
                  {booking.paymentStatus === PaymentStatus.PAID && (
                    <Checkbox
                      id="toggle-2"
                      defaultChecked
                      disabled
                      className="w-5 h-5"
                    />
                  )}
                </div>
              </TableCell>
              {/* Các button xử lý */}
              <TableCell className="py-4 pr-4 text-black">
                <div className="flex items-center justify-end gap-2">
                  {booking.bookingStatus === BookingStatus.RESERVED && (
                    <button
                      onClick={() => confirmBooking(booking.id)}
                      className="cursor-pointer"
                      title="Xác nhận đặt chỗ"
                    >
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        size="xl"
                        className="w-7 h-7 text-green-600"
                      />
                    </button>
                  )}

                  {booking.paymentStatus === PaymentStatus.PENDING && (
                    <button
                      onClick={() => updatePaymentStatus(booking.id)}
                      className="cursor-pointer"
                      title="Thanh toán hóa đơn"
                    >
                      <FontAwesomeIcon
                        icon={faMoneyBill}
                        size="xl"
                        className="w-7 h-7"
                      />
                    </button>
                  )}
                  {booking.paymentStatus === PaymentStatus.PAID && (
                    <button
                      onClick={() => downloadInvoice(booking.id)}
                      className="cursor-pointer"
                      title="In hóa đơn"
                    >
                      <FontAwesomeIcon
                        icon={faPrint}
                        size="xl"
                        className="w-7 h-7 text-blue-600"
                      />
                    </button>
                  )}
                  {booking.bookingStatus !== BookingStatus.CANCELLED &&
                    booking.paymentStatus === PaymentStatus.PENDING && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="cursor-pointer"
                        title="Huỷ đặt chỗ"
                      >
                        <FontAwesomeIcon
                          icon={faBan}
                          size="xl"
                          className="w-7 h-7 text-red-600"
                        />
                      </button>
                    )}
                  {booking.trip && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`/admin/trip?startDate=${booking.trip.departureTime}&endDate=${booking.trip.departureTime}&busId=${booking.trip.busId}&routeId=${booking.trip.routeId}`}
                    >
                      <FontAwesomeIcon icon={faBusSide} size="lg" />
                    </a>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
