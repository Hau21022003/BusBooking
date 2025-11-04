"use client";
import { Schedule } from "@/types/schedule.type";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateSchedule,
  createScheduleSchema,
} from "@/schemas/schedule.schema";
import { SeatType } from "@/enums/bus.enum";
import { Bus } from "@/types/bus.type";
import { Route } from "@/types/route.type";
import Combobox from "@/components/combobox";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { handleErrorApi } from "@/lib/error";
import { useRouter } from "next/navigation";
import { scheduleApiRequest } from "@/api-requests/schedule";
import { seatTypeLabels } from "@/enums/bus-model.enum";

interface SaveDialogProps {
  open: boolean;
  onClose: () => void;
  selectedSchedule?: Schedule;
  busList: Bus[];
  routes: Route[];
}

export default function SaveDialog({
  onClose,
  open,
  selectedSchedule,
  busList,
  routes,
}: SaveDialogProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: { departureTimes: [], prices: {}, active: true },
  });
  const save = async (data: CreateSchedule) => {
    try {
      if (selectedSchedule) {
        await scheduleApiRequest.update(selectedSchedule.id, data);
      } else {
        await scheduleApiRequest.create(data);
      }
    } catch (error) {
      handleErrorApi({ error });
    }
    onClose();
    form.reset({ departureTimes: [], prices: {}, active: true });
    router.refresh();
  };

  useEffect(() => {
    if (selectedSchedule) {
      form.reset(selectedSchedule);
    } else {
      form.reset({ departureTimes: [], prices: {}, active: true });
    }
  }, [selectedSchedule]);

  // const seatTypeMap: Record<SeatType, string> = {
  //   [SeatType.FRONT]: "Ghế đầu",
  //   [SeatType.MIDDLE]: "Ghế giữa",
  //   [SeatType.BACK]: "Ghế sau",
  //   [SeatType.STANDARD]: "Ghế thường",
  //   [SeatType.VIP]: "Ghế vip",
  // };

  const setDefaultPrices = (bus: Bus) => {
    const seatTypes = bus.seatLayout.seats.reduce((result, seat) => {
      if (!(seat.type in result)) {
        result[seat.type] = 0;
      }
      return result;
    }, {} as Record<string, number>);
    form.setValue("prices", seatTypes);
  };

  const deleteDepartureTime = (departureTimeIndex: number) => {
    const departureTimes = form.getValues("departureTimes") || [];
    const updated = departureTimes.filter(
      (_, idx) => idx !== departureTimeIndex
    );
    form.setValue("departureTimes", updated);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col space-y-2">
        <DialogHeader>
          <DialogTitle>
            {selectedSchedule ? "Sửa" : "Tạo mới"} lịch trình
          </DialogTitle>
          <Form {...form}>
            <form
              className="space-y-4 mt-2"
              onSubmit={form.handleSubmit(
                (data) => {
                  save(data);
                },
                (errors) => {
                  console.log("error", errors);
                  console.log(form.getValues());
                }
              )}
            >
              <FormField
                control={form.control}
                name="busId"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Xe khách</FormLabel>
                    <Combobox
                      options={busList.map((bus) => ({
                        label: `${bus.busModel?.name}, biển: ${bus.licensePlate}`,
                        value: bus.id,
                      }))}
                      className={cn(
                        "w-full",
                        fieldState.error && "border-red-500 focus:ring-red-500"
                      )}
                      placeholder="Chọn xe khách"
                      value={field.value}
                      onChange={(busId) => {
                        field.onChange(busId);
                        const bus = busList.findLast((bus) => bus.id === busId);
                        if (bus) setDefaultPrices(bus);
                      }}
                    />
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="routeId"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Tuyến đường</FormLabel>
                    <Combobox
                      options={routes.map((route) => ({
                        label: route.name,
                        value: route.id,
                      }))}
                      className={cn(
                        "w-full",
                        fieldState.error && "border-red-500 focus:ring-red-500"
                      )}
                      placeholder="Chọn tuyến đường"
                      value={field.value}
                      onChange={(routeId) => {
                        field.onChange(routeId);
                      }}
                    />
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex gap-4 items-center">
                      <div
                        onClick={() => field.onChange(true)}
                        className={cn(
                          "flex-1 h-9 flex items-center px-4 font-medium text-sm cursor-pointer",
                          "border rounded-md border-gray-300 bg-gray-50",
                          field.value && "bg-blue-50 border-blue-400"
                        )}
                      >
                        Hoạt động
                      </div>
                      <div
                        onClick={() => field.onChange(false)}
                        className={cn(
                          "flex-1 h-9 flex items-center px-4 font-medium text-sm cursor-pointer",
                          "border rounded-md border-gray-300 bg-gray-50",
                          !field.value && "bg-blue-50 border-blue-400"
                        )}
                      >
                        Không hoạt động
                      </div>
                    </div>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              {Object.entries(form.watch("prices")).length !== 0 && (
                <div className="space-y-3">
                  <FormLabel>Bảng giá ghế</FormLabel>
                  <div className="space-y-3">
                    {/* {Object.entries(form.watch("prices")).map( */}
                    {(
                      Object.entries(form.watch("prices")) as [
                        keyof typeof SeatType,
                        number
                      ][]
                    ).map(([seatType, price]) => {
                      const error = form.formState.errors.prices?.[seatType];
                      return (
                        <div
                          key={seatType}
                          className="flex items-stretch gap-2 "
                        >
                          <div
                            className={cn(
                              "overflow-hidden flex-1 flex items-center gap-2 ",
                              "border-gray-300 shadow border rounded-md",
                              !!error && "border-red-500 focus:ring-red-500"
                            )}
                          >
                            <div className="ml-3 flex items-center">
                              <p className="text-sm truncate">
                                {seatTypeLabels[seatType as SeatType]}:
                              </p>
                            </div>
                            <div className="flex-1 py-[6px]">
                              <input
                                className="w-full outline-none text-sm"
                                type="text"
                                placeholder="Nhập giá ghế"
                                value={
                                  form.watch(
                                    `prices.${seatType as SeatType}`
                                  ) !== undefined
                                    ? new Intl.NumberFormat("vi-VN").format(
                                        form.watch(
                                          `prices.${seatType as SeatType}`
                                        ) as number
                                      )
                                    : ""
                                }
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/\./g, "");
                                  const price = parseInt(raw, 10);
                                  if (!isNaN(price)) {
                                    form.setValue("prices", {
                                      ...form.getValues("prices"),
                                      [seatType]: price,
                                    });
                                  } else {
                                    form.setValue("prices", {
                                      ...form.getValues("prices"),
                                      [seatType]: 0,
                                    });
                                  }
                                }}
                              />
                            </div>
                            <div className="text-xs bg-gray-100 h-full flex items-center font-medium px-3">
                              VND
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <div className="flex gap-2 items-center">
                  <FormLabel>Giờ khởi hành</FormLabel>
                  <Plus
                    className="w-5 h-5 cursor-pointer"
                    onClick={() =>
                      form.setValue("departureTimes", [
                        ...(form.getValues("departureTimes") || []),
                        { hour: 0, minute: 0 },
                      ])
                    }
                  />
                </div>
                {form.watch("departureTimes").length !== 0 && (
                  <div className="bg-gray-100 rounded-lg p-2 flex gap-2 flex-wrap">
                    {form
                      .watch("departureTimes")
                      ?.map((departureTime, departureTimeIdx) => (
                        <div
                          key={departureTimeIdx}
                          className="flex gap-2 items-center group"
                        >
                          <div
                            className={cn(
                              "bg-white rounded-md overflow-hidden",
                              "flex gap-1 items-center px-2 py-1 border border-gray-300",
                              "hover:bg-blue-100 hover:border-blue-400",
                              "focus-within:bg-blue-100 focus-within:border-blue-400"
                            )}
                          >
                            <input
                              type="number"
                              min="0"
                              max="23"
                              value={String(departureTime.hour).padStart(
                                2,
                                "0"
                              )}
                              className="w-6 outline-none no-spinner"
                              onChange={(e) => {
                                const num = Number(e.target.value);
                                if (isNaN(num)) return;
                                if (num < 0 || num >= 24) return;
                                form.setValue(
                                  `departureTimes.${departureTimeIdx}.hour`,
                                  num
                                );
                              }}
                            />
                            :
                            <input
                              type="number"
                              min="0"
                              max="59"
                              value={String(
                                Number(departureTime.minute)
                              ).padStart(2, "0")}
                              className="w-6 outline-none no-spinner"
                              onChange={(e) => {
                                const num = Number(e.target.value);
                                if (isNaN(num)) return;
                                if (num < 0 || num >= 60) return;
                                form.setValue(
                                  `departureTimes.${departureTimeIdx}.minute`,
                                  num
                                );
                              }}
                            />
                          </div>
                          <X
                            onClick={() =>
                              deleteDepartureTime(departureTimeIdx)
                            }
                            className="cursor-pointer w-5 h-5 sm:hidden group-hover:block"
                          />
                        </div>
                      ))}
                    <style jsx>{`
                      .no-spinner::-webkit-inner-spin-button,
                      .no-spinner::-webkit-outer-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                      }
                      .no-spinner {
                        -moz-appearance: textfield;
                        appearance: textfield;
                      }
                    `}</style>
                  </div>
                )}
              </div>

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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
