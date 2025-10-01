import { Schedule } from "@/types/schedule.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { BusType } from "@/enums/bus.enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { handleErrorApi } from "@/lib/error";
import { useRouter } from "next/navigation";
import { scheduleApiRequest } from "@/api-requests/schedule";
import { Switch } from "@/components/ui/switch";

interface ScheduleTableProps {
  schedules: Schedule[];
  openSaveDialog: (selectedSchedule?: Schedule) => void;
}
export default function ScheduleTable({
  openSaveDialog,
  schedules,
}: ScheduleTableProps) {
  const router = useRouter();
  const busTypeMap: Record<BusType, string> = {
    SEAT_16: "Xe 16 chỗ",
    LIMOUSINE_9: "Xe Limousine 9 chỗ",
    SEAT_29: "Xe 29 chỗ",
    SLEEPER_34: "Xe giường nằm 34 chỗ",
  };

  const deleteSchedule = async (scheduleId: number) => {
    try {
      await scheduleApiRequest.delete(scheduleId);
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const updateActive = async (id: number, active: boolean) => {
    try {
      await scheduleApiRequest.updateActive(id, active ? "true" : "false");
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <div className="p-4 rounded-md bg-white">
      <Table className="text-gray-500 overflow-hidden border-collapse">
        <TableHeader>
          <TableRow className="">
            <TableHead className="font-medium text-gray-600 pl-4 rounded-tl-md rounded-bl-md">
              Xe khách
            </TableHead>
            <TableHead className="font-medium text-gray-600  hidden sm:table-cell">
              Tuyến
            </TableHead>
            <TableHead className="font-medium text-gray-600  hidden sm:table-cell">
              Các khung giờ
            </TableHead>
            <TableHead className="font-medium text-gray-600 text-center hidden sm:table-cell">
              Hoạt động
            </TableHead>
            <TableHead className="font-medium text-gray-600 text-right rounded-tr-md rounded-br-md">
              Xử lý
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          {schedules.map((schedule) => (
            <TableRow
              key={schedule.id}
              className={`py-4 border-b border-gray-200 w-60 truncate`}
            >
              <TableCell className="py-4 pl-4 text-black max-w-60 truncate">
                {`${busTypeMap[schedule.bus.type]}, biển: ${
                  schedule.bus.licensePlate
                }`}
              </TableCell>
              <TableCell className="py-4 text-black max-w-40 truncate">
                {schedule.route.name}
              </TableCell>
              <TableCell className="py-4 text-black max-w-60 truncate">
                {schedule.departureTimes.reduce(
                  (result, item, idx) =>
                    idx !== 0
                      ? result +
                        ", " +
                        `${String(Number(item.hour)).padStart(2, "0")}:${String(
                          Number(item.minute)
                        ).padStart(2, "0")}`
                      : `${String(Number(item.hour)).padStart(2, "0")}:${String(
                          Number(item.minute)
                        ).padStart(2, "0")}`,
                  ""
                )}
              </TableCell>
              <TableCell className="py-4 text-black max-w-40 truncate ">
                <div className="flex justify-center items-center">
                  <Switch
                    checked={schedule.active}
                    onCheckedChange={(checked) =>
                      updateActive(schedule.id, checked)
                    }
                  />
                </div>
              </TableCell>
              <TableCell className="py-4 pr-4 text-black">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => openSaveDialog(schedule)}
                    className="h-10 w-10 flex items-center justify-center rounded-md bg-black cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="w-6 h-6 text-white"
                      size="lg"
                    />
                  </button>
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="h-10 w-10 flex items-center justify-center rounded-md bg-red-700 cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="w-6 h-6 text-white"
                      size="lg"
                    />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
