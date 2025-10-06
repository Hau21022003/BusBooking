"use client";

import { useHomeStore } from "@/app/(user)/home/store";
import { busTypeMap } from "@/enums/bus.enum";
import { SeatStatus } from "@/enums/trip.enum";
import { Trip } from "@/types/trip.type";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface TripGridProps {
  trips: Trip[];
}
export default function TripGrid({ trips }: TripGridProps) {
  const { timeRange } = useHomeStore();

  const filtered = trips.filter((trip) => {
    const dep = new Date(trip.departureTime);
    const hours = dep.getHours();
    const minutes = dep.getMinutes();

    // Chuyển thời gian thành đơn vị 30 phút (0 - 48)
    const timeValue = hours * 2 + (minutes >= 30 ? 1 : 0);

    return timeValue >= timeRange[0] && timeValue <= timeRange[1];
  });

  return (
    <div className="grid grid-cols-1 items-stretch lg:grid-cols-2 gap-4">
      {filtered.map((trip) => (
        <div
          key={trip.id}
          className="border border-gray-200 p-4 flex gap-4 rounded-xl hover:shadow-lg bg-white"
        >
          <Image
            alt={trip.bus.licensePlate}
            src={trip.bus.imageUrl || ""}
            width={50}
            height={50}
            quality={100}
            className="object-cover w-30 h-30"
          />
          <div className="space-y-3 flex-1">
            <p className="leading-none truncate">{busTypeMap[trip.bus.type]}</p>
            <p className="text-lg font-bold leading-none">
              {(() => {
                const prices = Object.values(trip.prices).filter(
                  (p): p is number => p !== undefined
                );
                if (prices.length === 0) return "Chưa có giá";
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                return min === max
                  ? `${min.toLocaleString("vi-VN")} VND`
                  : `Từ ${min.toLocaleString("vi-VN")} VND`;
              })()}
            </p>
            <p className="leading-none truncate text-gray-500">
              Giờ khởi hành:{" "}
              {new Intl.DateTimeFormat("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(new Date(trip.departureTime))}
            </p>
            <p className="leading-none">
              {trip.seats.reduce((result, seat) => {
                if (seat.status === SeatStatus.AVAILABLE) return result + 1;
                else return result;
              }, 0)}{" "}
              ghế trống
            </p>
            <Link className="w-fit" href={`/bookingconfirmation/${trip.id}`}>
              <div className="cursor-pointer w-fit leading-none py-2 px-3 rounded-sm bg-yellow-300">
                Chọn chuyến
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
