"use client";
/* eslint-disable @next/next/no-img-element */
import { Bus } from "@/types/bus.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CreateBus, createBusSchema } from "@/schemas/bus.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { BusType, SeatType } from "@/enums/bus.enum";
import SteeringWheelIcon from "@/components/icon/steering-wheel-icon";
import { Loader2, Plus } from "lucide-react";
import SeatIcon, { SeatVariant } from "@/components/icon/seat-icon";
import { cn } from "@/lib/utils";
import { handleErrorApi } from "@/lib/error";
import { busApiRequest } from "@/api-requests/bus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useUploadFile } from "@/hooks/use-upload-file";
import { toast } from "sonner";
import { revalidateApiRequest } from "@/api-requests/revalidate";
import { useRouter } from "next/navigation";

export default function SaveDialog({
  open,
  onClose,
  selectedBus,
}: {
  open: boolean;
  onClose: () => void;
  selectedBus?: Bus;
}) {
  const router = useRouter();
  const { isUpLoading, fileInputRef, handleFileChange, openFileDialog } =
    useUploadFile();

  const form = useForm({
    resolver: zodResolver(createBusSchema),
    defaultValues: { seatLayout: { seats: [] } },
  });

  const busType = useWatch({ control: form.control, name: "type" });
  useEffect(() => {
    let rows = 0;
    let cols = 0;
    if (busType === BusType.SEAT_16) {
      rows = 5;
      cols = 4;
    } else if (busType === BusType.SEAT_29) {
      rows = 10;
      cols = 4;
    } else if (busType === BusType.SLEEPER_34) {
      rows = 8;
      cols = 5;
    } else if (busType === BusType.LIMOUSINE_9) {
      rows = 4;
      cols = 3;
    }

    form.setValue("seatLayout.rows", rows);
    form.setValue("seatLayout.cols", cols);
  }, [busType]);

  useEffect(() => {
    if (selectedBus) form.reset(selectedBus);
    else form.reset({ seatLayout: { seats: [] } });
  }, [selectedBus]);

  const saveBus = async (data: CreateBus) => {
    if (!data.imageUrl) {
      toast.error("Lỗi", {
        duration: 3000,
        description: "Hình ảnh xe khách bị trống",
      });
      return;
    }
    try {
      if (selectedBus) {
        await busApiRequest.update(selectedBus.id, data);
      } else {
        await busApiRequest.create(data);
      }
      await revalidateApiRequest("bus");
      onClose();
      form.reset({ seatLayout: { seats: [] } });
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const seatVariantMap: Record<SeatType, SeatVariant> = {
    [SeatType.FRONT]: "front",
    [SeatType.MIDDLE]: "middle",
    [SeatType.BACK]: "back",
    [SeatType.STANDARD]: "default",
    [SeatType.VIP]: "vip",
  };

  const addSeat = ({
    row,
    col,
    type,
  }: {
    row: number;
    col: number;
    type: SeatType;
  }) => {
    const seats = form.watch("seatLayout.seats") || [];
    seats.push({ row, col, type, id: "_" });
    form.setValue("seatLayout.seats", seats);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>{selectedBus ? "Sửa" : "Tạo mới"} xe khách</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(
              (data) => {
                saveBus(data);
              },
              (errors) => {
                console.log("error", errors);
              }
            )}
          >
            <div className="flex items-stretch gap-4">
              <div
                className={cn(
                  "w-38 h-38 cursor-pointer rounded-lg flex items-center justify-center overflow-hidden relative",
                  form.watch("imageUrl")
                    ? ""
                    : "border-2 border-gray-300 border-dashed"
                )}
                onClick={openFileDialog}
              >
                {form.watch("imageUrl") && (
                  <div className="h-full w-full relative group overflow-hidden">
                    <img
                      alt=""
                      src={form.watch("imageUrl")}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <FontAwesomeIcon
                        size="4x"
                        className="w-7 h-7 text-white"
                        icon={faCloudArrowUp}
                      />
                    </div>
                  </div>
                )}
                {!form.watch("imageUrl") && !isUpLoading && (
                  <FontAwesomeIcon
                    size="4x"
                    className="w-7 h-7 text-gray-400"
                    icon={faCloudArrowUp}
                  />
                )}
                {isUpLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                    <Loader2 className="text-black h-10 w-10 animate-spin" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const imageUrlPromise = handleFileChange(e);
                  imageUrlPromise.then((imageUrl) => {
                    if (imageUrl) form.setValue("imageUrl", imageUrl);
                  });
                }}
                hidden
              />
              <div className="flex-1 flex gap-4 flex-col items-start">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex-1 space-y-1 w-full">
                      <FormLabel>Loại xe</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn loại xe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={BusType.SEAT_16}>
                            Xe 16 chỗ ngồi
                          </SelectItem>
                          <SelectItem value={BusType.SEAT_29}>
                            Xe 29 chỗ ngồi
                          </SelectItem>
                          <SelectItem value={BusType.SLEEPER_34}>
                            Xe giường nằm 34 chỗ
                          </SelectItem>
                          <SelectItem value={BusType.LIMOUSINE_9}>
                            Xe Limousine 9 chỗ
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem className="flex-1 space-y-1 w-full">
                      <FormLabel>Biển số</FormLabel>
                      <Input
                        className="bg-white"
                        placeholder="VD: 30A-123.45"
                        {...field}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {form.watch("seatLayout.rows") > 0 &&
              form.watch("seatLayout.cols") > 0 && (
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <div className="w-fit p-4 pt-7 bg-gray-100 rounded-t-3xl rounded-b-lg">
                    <div
                      className="grid gap-2"
                      style={{
                        gridTemplateColumns: `repeat(${form.watch(
                          "seatLayout.cols"
                        )}, minmax(0,1fr))`,
                      }}
                    >
                      <div
                        style={{ width: "50px", height: "50px" }}
                        className="flex items-center justify-center p-2"
                      >
                        <SteeringWheelIcon />
                      </div>
                      {Array.from({
                        length: form.watch("seatLayout.rows"),
                      }).map((_, rowIndex) =>
                        Array.from({
                          length: form.watch("seatLayout.cols"),
                        }).map((_, colIndex) => {
                          const seats = form.watch("seatLayout.seats") || [];
                          const seat = seats.find(
                            (seat) =>
                              seat.row === rowIndex && seat.col === colIndex
                          );
                          return (
                            (colIndex !== 0 || rowIndex !== 0) && (
                              <div key={`${rowIndex}-${colIndex}`}>
                                {seat ? (
                                  <div
                                    className={cn(
                                      "cursor-pointer flex items-center justify-center"
                                    )}
                                    onClick={() => {
                                      const updatedSeats = seats.filter(
                                        (s) =>
                                          !(
                                            s.row === seat.row &&
                                            s.col === seat.col
                                          )
                                      );
                                      form.setValue(
                                        "seatLayout.seats",
                                        updatedSeats
                                      );
                                    }}
                                    style={{ width: "50px", height: "50px" }}
                                  >
                                    <SeatIcon
                                      size={50}
                                      variant={seatVariantMap[seat.type]}
                                    />
                                  </div>
                                ) : (
                                  <Popover>
                                    <PopoverTrigger>
                                      <div
                                        className={cn(
                                          "cursor-pointer flex items-center justify-center p-2",
                                          seat
                                            ? ""
                                            : "border border-gray-400 rounded"
                                        )}
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                      >
                                        <Plus className="w-5 h-5 text-gray-500 cursor-pointer" />
                                      </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-0">
                                      <div>
                                        <div
                                          onClick={() => {
                                            setTimeout(() => {
                                              addSeat({
                                                row: rowIndex,
                                                col: colIndex,
                                                type: SeatType.STANDARD,
                                              });
                                            }, 0);
                                          }}
                                          className="cursor-pointer px-4 h-9 flex items-center leading-none hover:bg-gray-50"
                                        >
                                          Ghế thường
                                        </div>
                                        <div
                                          onClick={() => {
                                            setTimeout(() => {
                                              addSeat({
                                                row: rowIndex,
                                                col: colIndex,
                                                type: SeatType.VIP,
                                              });
                                            }, 0);
                                          }}
                                          className="cursor-pointer px-4 h-9 flex items-center leading-none hover:bg-gray-50"
                                        >
                                          Ghế vip
                                        </div>
                                        <div
                                          onClick={() => {
                                            setTimeout(() => {
                                              addSeat({
                                                row: rowIndex,
                                                col: colIndex,
                                                type: SeatType.FRONT,
                                              });
                                            }, 0);
                                          }}
                                          className="cursor-pointer px-4 h-9 flex items-center leading-none hover:bg-gray-50"
                                        >
                                          Ghế đầu
                                        </div>
                                        <div
                                          onClick={() => {
                                            setTimeout(() => {
                                              addSeat({
                                                row: rowIndex,
                                                col: colIndex,
                                                type: SeatType.MIDDLE,
                                              });
                                            }, 0);
                                          }}
                                          className="cursor-pointer px-4 h-9 flex items-center leading-none hover:bg-gray-50"
                                        >
                                          Ghế giữa
                                        </div>
                                        <div
                                          onClick={() => {
                                            setTimeout(() => {
                                              addSeat({
                                                row: rowIndex,
                                                col: colIndex,
                                                type: SeatType.BACK,
                                              });
                                            }, 0);
                                          }}
                                          className="cursor-pointer px-4 h-9 flex items-center leading-none hover:bg-gray-50"
                                        >
                                          Ghế cuối
                                        </div>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </div>
                            )
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap sm:flex-col gap-4">
                    <div className="flex gap-2 items-center">
                      <SeatIcon size={40} />
                      <p>Ghế thường</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <SeatIcon variant="vip" size={40} />
                      <p>Ghế vip</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <SeatIcon variant="front" size={40} />
                      <p>Ghế đầu</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <SeatIcon variant="middle" size={40} />
                      <p>Ghế giữa</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <SeatIcon variant="back" size={40} />
                      <p>Ghế cuối</p>
                    </div>
                  </div>
                </div>
              )}

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
