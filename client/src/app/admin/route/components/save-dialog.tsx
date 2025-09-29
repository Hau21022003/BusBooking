"use client";
import {
  Form,
  FormControl,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Route } from "@/types/route.type";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateRoute, createRouteSchema } from "@/schemas/route.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { EllipsisVertical, Plus } from "lucide-react";
import { Station } from "@/types/station.type";
import Combobox from "@/components/combobox";
import { cn } from "@/lib/utils";
import { RouteStopType } from "@/enums/route-stop";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/error";
import { routeApiRequest } from "@/api-requests/route-api";

interface SaveDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRoute?: Route;
  stations: Station[];
}

export default function SaveDialog({
  onClose,
  open,
  selectedRoute,
  stations,
}: SaveDialogProps) {
  const route = useRouter();
  const form = useForm({
    resolver: zodResolver(createRouteSchema),
    defaultValues: { stops: [] },
  });

  useEffect(() => {
    if (selectedRoute) {
      form.reset(selectedRoute);
    } else {
      form.reset({ stops: [] });
    }
  }, [selectedRoute]);

  const saveRoute = async (data: CreateRoute) => {
    try {
      if (selectedRoute) {
        await routeApiRequest.update(selectedRoute.id, data);
      } else {
        await routeApiRequest.create(data);
      }
      onClose();
      form.reset({ stops: [] });
      route.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const addStopRoute = () => {
    const stations = form.watch("stops") || [];
    stations.push({
      arrivalSeconds: 0,
      name: "",
      type: RouteStopType.STOP,
    });
    form.setValue("stops", stations);
  };

  const deleteStopRoute = (index: number) => {
    const stops = form.getValues("stops");
    const updatedStops = stops.filter((_, idx) => idx !== index);
    form.setValue("stops", updatedStops);
  };

  const swapStopRoute = (index: number, mode: "up" | "down") => {
    const stops = form.getValues("stops");
    const newIndex = mode === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= stops.length) return;

    const updatedStops = [...stops];

    const temp = updatedStops[index];
    updatedStops[index] = updatedStops[newIndex];
    updatedStops[newIndex] = temp;
    form.setValue("stops", updatedStops);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col space-y-2">
        <DialogHeader>
          <DialogTitle>
            {selectedRoute ? "Sửa" : "Tạo mới"} tuyến đường
          </DialogTitle>
          <Form {...form}>
            <form
              className="space-y-4 mt-2"
              onSubmit={form.handleSubmit(
                (data) => {
                  saveRoute(data);
                },
                (errors) => {
                  console.log("error", errors);
                }
              )}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Tên tuyến đường</FormLabel>
                    <Input
                      className="bg-white"
                      placeholder="Nhập tên tuyến đường"
                      {...field}
                    />
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              <div className="space-y-3">
                <div className="flex gap-2">
                  <FormLabel>Các điểm đến</FormLabel>
                  <button
                    onClick={addStopRoute}
                    type="button"
                    className="cursor-pointer"
                  >
                    <Plus className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                {form.watch("stops").length !== 0 && (
                  <div className="space-y-2">
                    {form.watch("stops")?.map((s, stationIdx) => {
                      const hasError =
                        !!form.formState.errors.stops?.[stationIdx]?.name;
                      return (
                        <div
                          key={`station_${stationIdx}`}
                          className="flex gap-2"
                        >
                          <Select
                            onValueChange={(value) =>
                              form.setValue(
                                `stops.${stationIdx}.type`,
                                value as RouteStopType
                              )
                            }
                            defaultValue={form.getValues(
                              `stops.${stationIdx}.type`
                            )}
                          >
                            <FormControl>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Chọn loại" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={RouteStopType.STOP}>
                                Điểm dừng
                              </SelectItem>
                              <SelectItem value={RouteStopType.STATION}>
                                Trạm
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex-1">
                            {form.watch(`stops.${stationIdx}.type`) ===
                            RouteStopType.STATION ? (
                              <Combobox
                                options={stations.map((station) => ({
                                  label: station.name,
                                  value: station.id.toString(),
                                }))}
                                className={cn(
                                  "w-full",
                                  hasError &&
                                    "border-red-500 focus:ring-red-500"
                                )}
                                placeholder="Chọn trạm dừng"
                                value={(
                                  form.watch(`stops.${stationIdx}.stationId`) ||
                                  ""
                                ).toString()}
                                onChange={(stationId) => {
                                  const station = stations.findLast(
                                    (station) =>
                                      station.id === Number(stationId)
                                  );
                                  if (station) {
                                    form.setValue(
                                      `stops.${stationIdx}.stationId`,
                                      station.id
                                    );
                                    form.setValue(
                                      `stops.${stationIdx}.name`,
                                      station.name
                                    );
                                  }
                                }}
                              />
                            ) : (
                              <Input
                                className={cn(
                                  "bg-white text-sm",
                                  hasError &&
                                    "border-red-500 focus:ring-red-500"
                                )}
                                placeholder="Nhập tên tuyến đường"
                                value={form.watch(`stops.${stationIdx}.name`)}
                                onChange={(e) => {
                                  form.setValue(
                                    `stops.${stationIdx}.name`,
                                    e.target.value
                                  );
                                }}
                              />
                            )}
                          </div>
                          <div
                            className="px-2 flex items-center
                                   border border-gray-300 rounded-md shadow"
                          >
                            <input
                              type="number"
                              value={form.watch(
                                `stops.${stationIdx}.arrivalSeconds`
                              )}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0) {
                                  form.setValue(
                                    `stops.${stationIdx}.arrivalSeconds`,
                                    value
                                  );
                                }
                              }}
                              className="w-10 min-w-0 outline-none leading-none"
                            />
                            <p className="p-[2px] font-medium text-white text-sm px-3 bg-gray-500 rounded-md">
                              m
                            </p>
                          </div>
                          <Popover>
                            <PopoverTrigger>
                              <div className="cursor-pointer overflow-hidden">
                                <EllipsisVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 p-0 overflow-hidden">
                              <div>
                                <div
                                  onClick={() => {
                                    setTimeout(() => {
                                      swapStopRoute(stationIdx, "up");
                                    }, 0);
                                  }}
                                  className="cursor-pointer px-4 h-9 flex items-center leading-none hover:bg-gray-50"
                                >
                                  Lên trên
                                </div>
                                <div
                                  onClick={() => {
                                    setTimeout(() => {
                                      swapStopRoute(stationIdx, "down");
                                    }, 0);
                                  }}
                                  className="cursor-pointer px-4 h-9 flex items-center leading-none hover:bg-gray-50"
                                >
                                  Xuống dưới
                                </div>
                                <div
                                  onClick={() => {
                                    setTimeout(() => {
                                      deleteStopRoute(stationIdx);
                                    }, 0);
                                  }}
                                  className="cursor-pointer px-4 h-9 flex items-center leading-none hover:bg-gray-50"
                                >
                                  Xóa
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      );
                    })}
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
