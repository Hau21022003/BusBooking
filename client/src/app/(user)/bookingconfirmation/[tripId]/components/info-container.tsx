import Combobox from "@/components/combobox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateBookingPublic } from "@/schemas/booking.schema";
import { Station } from "@/types/station.type";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";

type PickupLocationType = "IN_STATION" | "OTHER";
interface InfoContainerProps {
  form: UseFormReturn<CreateBookingPublic>;
  stations: Station[];
}
export default function InfoContainer({ form, stations }: InfoContainerProps) {
  const [pickupLocationType, setPickupLocationType] =
    useState<PickupLocationType>("IN_STATION");
  const [selectedStationId, setSelectedStationId] = useState<string>();
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">Thông tin liên hệ</p>
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="flex-1 space-y-1 w-full">
            <FormLabel>Số điện thoại</FormLabel>
            <Input
              className="bg-white"
              placeholder="Nhập số điện thoại"
              {...field}
            />

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pickupLocation"
        render={({ field }) => (
          <FormItem className="flex-1 space-y-1 w-full">
            <FormLabel>Địa điểm đón khách</FormLabel>
            <div className="flex gap-2 items-stretch">
              <Select
                onValueChange={(value: PickupLocationType) =>
                  setPickupLocationType(value)
                }
                value={pickupLocationType}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Chọn nơi đón" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_STATION">Tại trạm</SelectItem>
                  <SelectItem value="OTHER">Khác</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1">
                {pickupLocationType === "IN_STATION" ? (
                  <Combobox
                    options={(stations || []).map((station) => ({
                      label: station.name,
                      value: station.id.toString(),
                    }))}
                    className="w-full"
                    placeholder="Chọn trạm"
                    value={selectedStationId}
                    onChange={(stationId) => {
                      const station = stations.findLast(
                        (station) => station.id.toString() === stationId
                      );
                      if (stationId && station) {
                        form.setValue("pickupLocation", station?.name);
                        setSelectedStationId(stationId);
                      } else {
                        form.setValue("pickupLocation", "");
                        setSelectedStationId(undefined);
                      }
                    }}
                  />
                ) : (
                  <Input
                    className="bg-white"
                    placeholder="Nhập địa điểm đón khách"
                    {...field}
                  />
                )}
              </div>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
      <button
        type="submit"
        className="py-[10px] font-medium w-full bg-yellow-400 rounded-md leading-none text-center"
      >
        Đặt vé
      </button>
    </div>
  );
}
