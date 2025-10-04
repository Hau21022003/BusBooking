import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingStatus, PaymentStatus } from "@/enums/booking.enum";
import { CreateBooking, CreateBookingSchema } from "@/schemas/booking.schema";
import { SeatTrip } from "@/types/trip.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Combobox from "@/components/combobox";
import { useTripStore } from "@/app/admin/trip/store";
import { handleErrorApi } from "@/lib/error";
import { bookingApiRequest } from "@/api-requests/booking";

export type PickupLocationType = "IN_STATION" | "OTHER";

interface SaveBookingDialogProps {
  open: boolean;
  onClose: () => void;
  tripInfo: {
    id: number;
    seatTrip: SeatTrip;
  };
}
export default function SaveBookingDialog({
  onClose,
  open,
  tripInfo,
}: SaveBookingDialogProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(CreateBookingSchema),
    defaultValues: {
      seat: tripInfo.seatTrip,
      tripId: tripInfo.id,
      paymentStatus: PaymentStatus.PENDING,
      bookingStatus: BookingStatus.CONFIRMED,
    },
  });
  const [pickupLocationType, setPickupLocationType] =
    useState<PickupLocationType>("IN_STATION");
  const [selectedStationId, setSelectedStationId] = useState<string>();

  const stations = useTripStore((state) => state.stations);
  const saveBooking = async (data: CreateBooking) => {
    if (
      data.paymentStatus === PaymentStatus.PENDING &&
      (!data.phone ||
        data.phone?.trim().length === 0 ||
        !data.pickupLocation ||
        data.pickupLocation?.trim().length === 0)
    ) {
      toast.error("Lỗi", {
        description: "Đặt vé online phải nhập thông tin cá nhân",
        duration: 3000,
      });
      return;
    }

    try {
      await bookingApiRequest.create(data);
    } catch (error) {
      handleErrorApi({ error });
    }
    onClose();
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col space-y-2">
        <DialogHeader>
          <DialogTitle>Đặt vé</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(
              (data) => saveBooking(data),
              (errors) => {
                console.log("error", errors);
              }
            )}
          >
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
                      <FormControl>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Chọn trạng thái thanh toán" />
                        </SelectTrigger>
                      </FormControl>
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
                            if (stationId) {
                              const station = stations.findLast(
                                (station) => station.id.toString() === stationId
                              );
                              form.setValue("pickupLocation", station?.name);
                              setSelectedStationId(stationId);
                            } else {
                              form.setValue("pickupLocation", undefined);
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
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-1 w-full">
                  <FormLabel>Trạng thái thanh toán</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trạng thái thanh toán" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PaymentStatus.PENDING}>
                        Chờ thanh toán
                      </SelectItem>
                      <SelectItem value={PaymentStatus.PAID}>
                        Đã thanh toán
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="cursor-pointer leading-none w-full sm:w-fit py-3 px-4 bg-black rounded-md text-white font-medium text-sm"
              >
                Lưu
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
