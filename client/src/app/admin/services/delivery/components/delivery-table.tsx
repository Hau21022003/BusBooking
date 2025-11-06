import { Delivery } from "@/types/delivery.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  faCircleCheck,
  faCircleXmark,
  faClock,
  faLink,
  faRotateLeft,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { PaginationMeta } from "@/types/pagination.type";
import React from "react";
import { DeliveryStatus, deliveryStatusLabels } from "@/enums/delivery.enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/lib/utils";
import PaginationContainer from "@/app/admin/services/delivery/components/pagination-container";

const getStatusIcon = (status?: DeliveryStatus) => {
  switch (status) {
    case DeliveryStatus.PENDING:
      return <FontAwesomeIcon icon={faClock} size="lg" />;
    case DeliveryStatus.IN_TRANSIT:
      return <FontAwesomeIcon icon={faTruck} size="lg" />;
    case DeliveryStatus.DELIVERED:
      return <FontAwesomeIcon icon={faCircleCheck} size="lg" />;
    case DeliveryStatus.CANCELLED:
      return <FontAwesomeIcon icon={faCircleXmark} size="lg" />;
    case DeliveryStatus.RETURNED:
      return <FontAwesomeIcon icon={faRotateLeft} size="lg" />;
    default:
      return <FontAwesomeIcon icon={faClock} size="lg" />;
  }
};

interface DeliveryTableProps {
  deliveries: Delivery[];
  pageMeta: PaginationMeta;
}

export default function DeliveryTable({
  deliveries,
  pageMeta,
}: DeliveryTableProps) {
  return (
    <div className="p-4 rounded-md bg-white">
      <Table className="text-gray-500 overflow-hidden border-collapse">
        <TableHeader className="">
          <TableRow className="border-b border-gray-300">
            <TableHead className="font-medium text-gray-700 py-4 rounded-tl-md">
              Thông tin
            </TableHead>
            <TableHead className="font-medium text-gray-700 py-4">
              Địa điểm
            </TableHead>
            <TableHead className="text-right font-medium text-gray-700 py-4">
              Giá
            </TableHead>
            <TableHead className="font-medium text-gray-700 py-4">
              Trạng thái
            </TableHead>
            <TableHead className="font-medium text-gray-700 py-4 text-center">
              Chuyến xe
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          {deliveries.map((delivery) => (
            <TableRow
              key={delivery.id}
              className={`py-4 border-b border-gray-300 bg-white truncate`}
            >
              <TableCell className="py-4 text-black">
                <div className="space-y-1">
                  <p>
                    Người gửi: {delivery.senderName}, SDT:{" "}
                    {delivery.senderPhone}
                  </p>
                  <p>
                    Người nhận: {delivery.receiverName}, SDT:{" "}
                    {delivery.receiverPhone}
                  </p>
                </div>
              </TableCell>
              <TableCell className="py-4 text-black">
                <div className="space-y-1">
                  <p>Điểm nhận: {delivery.pickupStation?.name}</p>
                  <p>Điểm giao: {delivery.dropoffStation?.name}</p>
                </div>
              </TableCell>
              <TableCell className="py-4 text-black text-right">
                {delivery.price.toLocaleString("vi-VN")} đ
              </TableCell>
              <TableCell className={cn("py-4 text-black")}>
                <div
                  className={cn(
                    "h-9 px-2 rounded-md flex items-center gap-1",
                    {
                      [DeliveryStatus.PENDING]: "text-yellow-600 bg-yellow-100",
                      [DeliveryStatus.IN_TRANSIT]:
                        "text-indigo-600 bg-indigo-100",
                      [DeliveryStatus.CANCELLED]: "text-red-600 bg-red-100",
                      [DeliveryStatus.DELIVERED]: "text-green-600 bg-green-100",
                      [DeliveryStatus.RETURNED]:
                        "text-orange-600 bg-orange-100",
                    }[delivery.status] || "text-gray-500"
                  )}
                >
                  {getStatusIcon(delivery.status)}
                  <span className="font-medium text-sm leading-none">
                    {deliveryStatusLabels[delivery.status]}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4 text-black">
                {delivery.trip && (
                  <div className="flex justify-center">
                    <a
                      href={`/admin/trip?startDate=${delivery.trip.departureTime}&endDate=${delivery.trip.departureTime}&busId=${delivery.trip.busId}&routeId=${delivery.trip.routeId}`}
                    >
                      <FontAwesomeIcon
                        icon={faLink}
                        size="lg"
                        className="w-6 h-6"
                      />
                    </a>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationContainer pageMeta={pageMeta} />
    </div>
  );
}
