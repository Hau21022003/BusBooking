import { deliveryApiRequest } from "@/api-requests/delivery";
import { routeApiRequest } from "@/api-requests/route-api";
import { useTripStore } from "@/app/admin/trip/store";
import Combobox from "@/components/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { DeliveryStatus, deliveryStatusLabels } from "@/enums/delivery.enum";
import { handleErrorApi } from "@/lib/error";
import { extractTime, formatDateWithRelative } from "@/lib/time";
import { cn } from "@/lib/utils";
import {
  CreateDeliveryInput,
  createDeliverySchema,
} from "@/schemas/delivery.schema";
import { Route } from "@/types/route.type";
import { Station } from "@/types/station.type";
import {
  faBusSide,
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faClock,
  faLocationCrosshairs,
  faLocationDot,
  faPhone,
  faRotateLeft,
  faTruck,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

interface SaveDeliveryProps {
  stations: Station[];
}

const getStatusIcon = (status: DeliveryStatus) => {
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

export default function SaveDelivery({ stations }: SaveDeliveryProps) {
  const router = useRouter();
  const [price, setPrice] = useState<number>();
  const form = useForm({
    resolver: zodResolver(createDeliverySchema),
    defaultValues: {},
  });
  const {
    isSaveDeliveryOpen,
    selectedDelivery,
    selectedTrip,
    closeSaveDelivery,
  } = useTripStore();

  useEffect(() => {
    if (selectedDelivery) form.reset(selectedDelivery);
    if (selectedTrip) {
      form.setValue("tripId", selectedTrip.id);
      form.setValue("routeId", selectedTrip.routeId);
    }
  }, [selectedTrip, selectedDelivery]);

  const weight = useWatch({
    control: form.control,
    name: "weight",
  });

  const tripId = useWatch({
    control: form.control,
    name: "tripId",
  });

  useEffect(() => {
    const load = async () => {
      if (weight && tripId) {
        try {
          const priceRes = await deliveryApiRequest.calculatePrice({
            tripId: tripId,
            weight: weight,
          });
          setPrice(priceRes.payload.price);
        } catch (error) {
          console.log("error", error);
        }
      } else {
        setPrice(undefined);
      }
    };
    load();
  }, [weight]);

  const saveDelivery = async (data: CreateDeliveryInput) => {
    try {
      if (selectedDelivery) {
        await deliveryApiRequest.update(selectedDelivery.id, data);
      } else {
        await deliveryApiRequest.create(data);
      }
      closeSaveDelivery();
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <Dialog open={isSaveDeliveryOpen} onOpenChange={closeSaveDelivery}>
      <DialogContent className="max-h-[96vh] overflow-y-auto flex flex-col space-y-2">
        <DialogHeader>
          <DialogTitle>
            {selectedDelivery ? "Sửa" : "Tạo mới"} giao hàng
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Info Chuyến đi */}
          <div className="flex items-start gap-4">
            <FontAwesomeIcon icon={faBusSide} size="lg" className="w-6 h-6" />
            {selectedTrip && (
              <div>
                <p className="line-clamp-1">
                  Tuyến: {selectedTrip.route.name}, Xe:{" "}
                  {selectedTrip.bus.licensePlate}
                </p>
                <p className="line-clamp-1">
                  Ngày đi:{" "}
                  {selectedTrip.departureTime &&
                    extractTime(selectedTrip.departureTime)}
                  {", "}
                  {formatDateWithRelative(selectedTrip.departureTime)}
                </p>
              </div>
            )}
          </div>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(
                (data) => saveDelivery(data),
                (errors) => {
                  console.log("error", errors);
                }
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCircleInfo} size="lg" />
                  <p className="leading-none font-medium text-sm">
                    Thông tin người gửi
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="senderName"
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1  w-full">
                          <div className="relative">
                            <FontAwesomeIcon
                              icon={faUser}
                              size="lg"
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                            />

                            <Input
                              className={cn(
                                "bg-white pl-10",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-300"
                              )}
                              placeholder="Tên người gửi"
                              {...field}
                            />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="senderPhone"
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1  w-full">
                          <div className="relative">
                            <FontAwesomeIcon
                              icon={faPhone}
                              size="lg"
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                            />

                            <Input
                              className={cn(
                                "bg-white pl-10",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-300"
                              )}
                              placeholder="SDT người gửi"
                              {...field}
                            />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCircleInfo} size="lg" />
                  <p className="leading-none font-medium text-sm">
                    Thông tin người nhận
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="receiverName"
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1  w-full">
                          <div className="relative">
                            <FontAwesomeIcon
                              icon={faUser}
                              size="lg"
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                            />

                            <Input
                              className={cn(
                                "bg-white pl-10",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-300"
                              )}
                              placeholder="Tên người gửi"
                              {...field}
                            />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="receiverPhone"
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1 w-full">
                          <div className="relative">
                            <FontAwesomeIcon
                              icon={faPhone}
                              size="lg"
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                            />

                            <Input
                              className={cn(
                                "bg-white pl-10",
                                fieldState.invalid &&
                                  "border-red-500 focus-visible:ring-red-300"
                              )}
                              placeholder="SDT người gửi"
                              {...field}
                            />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCircleInfo} size="lg" />
                  <p className="leading-none font-medium text-sm">
                    Địa điểm nhận hàng - giao hàng
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="pickupStationId"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <Combobox
                            options={stations?.map((station) => ({
                              label: station.name,
                              value: station.id.toString(),
                            }))}
                            icon={
                              <FontAwesomeIcon
                                icon={faLocationDot}
                                size="lg"
                                className="text-gray-500"
                              />
                            }
                            className={cn(
                              "w-full",
                              fieldState.error &&
                                "border-red-500 focus:ring-red-300"
                            )}
                            placeholder="Chọn xe khách"
                            value={field.value?.toString()}
                            onChange={(stationId) => {
                              if (stationId) field.onChange(Number(stationId));
                              else field.onChange(undefined);
                            }}
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="dropoffStationId"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <Combobox
                            options={stations?.map((station) => ({
                              label: station.name,
                              value: station.id.toString(),
                            }))}
                            icon={
                              <FontAwesomeIcon
                                icon={faLocationCrosshairs}
                                size="lg"
                                className="text-gray-500"
                              />
                            }
                            className={cn(
                              "w-full",
                              fieldState.error &&
                                "border-red-500 focus:ring-red-300"
                            )}
                            placeholder="Chọn xe khách"
                            value={field.value?.toString()}
                            onChange={(stationId) => {
                              if (stationId) field.onChange(Number(stationId));
                              else field.onChange(undefined);
                            }}
                          />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex-1  w-full">
                      <FormLabel>Cân nặng</FormLabel>
                      <div className="relative overflow-hidden rounded-md">
                        <Input
                          type="number"
                          className={cn(
                            "bg-white pr-10",
                            fieldState.invalid &&
                              "border-red-500 focus-visible:ring-red-300"
                          )}
                          placeholder="Tên người gửi"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                        <div
                          className={cn(
                            "absolute right-[2px] rounded-r-sm top-1/2 -translate-y-1/2 text-gray-500",
                            "bg-gray-300 h-8 aspect-square flex items-center justify-center"
                          )}
                        >
                          <p className="leading-none text-sm font-medium">kg</p>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-sm leading-none">Giá</p>
                  <div className="relative overflow-hidden rounded-md">
                    <Input
                      readOnly
                      className={cn("bg-white pr-10")}
                      placeholder="Giá vận chuyển"
                      value={price?.toLocaleString("vi-VN")}
                    />
                    <div
                      className={cn(
                        "absolute right-[1px] rounded-r-sm top-1/2 -translate-y-1/2 text-gray-500",
                        "bg-gray-300 h-8 px-2 flex items-center justify-center"
                      )}
                    >
                      <p className="leading-none text-sm font-medium">VND</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex-1  w-full">
                        <FormLabel>Chú thích</FormLabel>
                        <Input
                          className="bg-white"
                          placeholder="Nhập chú thích"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              {field.value ? (
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(field.value as DeliveryStatus)}
                                  <span>
                                    {
                                      deliveryStatusLabels[
                                        field.value as DeliveryStatus
                                      ]
                                    }
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">
                                  Chọn trạng thái giao hàng
                                </span>
                              )}
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {Object.values(DeliveryStatus).map((value) => (
                              <SelectItem key={value} value={value}>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(value)}
                                  <span>{deliveryStatusLabels[value]}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
