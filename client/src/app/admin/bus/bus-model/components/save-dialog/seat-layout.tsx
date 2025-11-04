import SeatIcon, { SeatVariant } from "@/components/icon/seat-icon";
import SteeringWheelIcon from "@/components/icon/steering-wheel-icon";
import { FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SeatType, seatTypeLabels } from "@/enums/bus-model.enum";
import { cn } from "@/lib/utils";
import { CreateBusModel } from "@/schemas/bus-model.schema";
import { Minus, Plus } from "lucide-react";
import React, { Fragment } from "react";
import { UseFormReturn } from "react-hook-form";

const seatVariantMap: Record<SeatType, SeatVariant> = {
  [SeatType.FRONT]: "front",
  [SeatType.MIDDLE]: "middle",
  [SeatType.BACK]: "back",
  [SeatType.STANDARD]: "default",
  [SeatType.VIP]: "vip",
};

export default function SeatLayout({
  form,
}: {
  form: UseFormReturn<CreateBusModel>;
}) {
  const editRows = (rows: number) => {
    if (rows >= 0 && rows <= 32) form.setValue("seatLayout.rows", rows);
  };
  const decreaseRows = () => {
    const rows = form.getValues("seatLayout.rows") || 0;
    editRows(rows - 1);
  };
  const increaseRows = () => {
    const rows = form.getValues("seatLayout.rows") || 0;
    editRows(rows + 1);
  };
  const editCols = (cols: number) => {
    if (cols >= 0 && cols <= 6) form.setValue("seatLayout.cols", cols);
  };

  const decreaseCols = () => {
    const rows = form.getValues("seatLayout.cols") || 0;
    editCols(rows - 1);
  };
  const increaseCols = () => {
    const rows = form.getValues("seatLayout.cols") || 0;
    editCols(rows + 1);
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
    seats.push({ row, col, type });
    form.setValue("seatLayout.seats", seats);
  };

  return (
    <Fragment>
      <div className="space-y-2">
        <p className="text-sm font-medium">Sơ đồ ghế ngồi</p>
        <div className="border border-dashed border-gray-300 p-2 rounded-md ">
          {/* Edit cols rows */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <p className="leading-none">Hàng</p>
              <div className={`flex items-center border border-gray-300`}>
                <button
                  type="button"
                  onClick={decreaseRows}
                  className="p-1 px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>

                <div className="px-3 py-1  bg-white border-x border-gray-300">
                  <input
                    type="number"
                    value={form.watch("seatLayout.rows")}
                    onChange={(e) => editRows(Number(e.target.value))}
                    min="1"
                    max={32}
                    className="w-8 text-center text-gray-800 outline-none bg-transparent 
                      [&::-webkit-inner-spin-button]:appearance-none 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [appearance:textfield]"
                  />
                </div>

                <button
                  type="button"
                  onClick={increaseRows}
                  className="p-1 px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="leading-none">Cột</p>
              <div className={`flex items-center border border-gray-300`}>
                <button
                  type="button"
                  onClick={decreaseCols}
                  className="p-1 px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>

                <div className="px-3 py-1  bg-white border-x border-gray-300">
                  <input
                    type="number"
                    value={form.watch("seatLayout.cols")}
                    onChange={(e) => editRows(Number(e.target.value))}
                    min="1"
                    max={32}
                    className="w-8 text-center text-gray-800 outline-none bg-transparent 
                      [&::-webkit-inner-spin-button]:appearance-none 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [appearance:textfield]"
                  />
                </div>

                <button
                  type="button"
                  onClick={increaseCols}
                  className="p-1 px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          {/* Layout seat */}
          {form.watch("seatLayout.rows") > 0 &&
            form.watch("seatLayout.cols") > 0 && (
              <div className="max-h-60 overflow-auto flex flex-col gap-4 mt-4">
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
                                      {Object.entries(seatTypeLabels).map(
                                        ([key, label]) => (
                                          <div
                                            key={key}
                                            onClick={() => {
                                              setTimeout(() => {
                                                addSeat({
                                                  row: rowIndex,
                                                  col: colIndex,
                                                  type: key as SeatType,
                                                });
                                              }, 0);
                                            }}
                                            className="cursor-pointer px-4 h-9 flex items-center leading-none hover:bg-gray-50"
                                          >
                                            {label}
                                          </div>
                                        )
                                      )}
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
                <div className="flex flex-row flex-wrap gap-4">
                  {Object.entries(seatTypeLabels).map(([key, label]) => (
                    <div key={key} className="flex gap-2 items-center">
                      <SeatIcon
                        variant={seatVariantMap[key as SeatType]}
                        size={40}
                      />
                      <p>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </Fragment>
  );
}
