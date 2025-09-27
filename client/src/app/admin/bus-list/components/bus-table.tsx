/* eslint-disable @next/next/no-img-element */
import { Bus } from "@/types/bus.type";
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
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/error";
import { busApiRequest } from "@/api-requests/bus";
import { revalidateApiRequest } from "@/api-requests/revalidate";

export default function BusTable({
  busList,
  openSaveDialog,
}: {
  busList: Bus[];
  openSaveDialog: (selectedBus?: Bus) => void;
}) {
  const router = useRouter();
  const busTypeLabels: Record<BusType, string> = {
    [BusType.SEAT_16]: "Xe 16 chỗ ngồi",
    [BusType.SEAT_29]: "Xe 29 chỗ ngồi",
    [BusType.SLEEPER_34]: "Xe giường nằm 34 chỗ",
    [BusType.LIMOUSINE_9]: "Xe Limousine 9 chỗ",
  };

  const deleteBus = async (busId: string) => {
    try {
      await busApiRequest.delete(busId);
      await revalidateApiRequest("bus");
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
              Hình ảnh
            </TableHead>
            <TableHead className="font-medium text-gray-600  hidden sm:table-cell">
              Loại xe
            </TableHead>
            <TableHead className="font-medium text-gray-600  hidden md:table-cell">
              Biển số
            </TableHead>
            <TableHead className="font-medium text-gray-600 text-right rounded-tr-md rounded-br-md">
              Xử lý
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          {busList.map((bus) => (
            <TableRow key={bus.id} className={`py-4 border-b border-gray-200`}>
              <TableCell className="py-4 pl-4 text-black">
                <img
                  alt={bus.licensePlate}
                  src={bus.imageUrl}
                  className="w-16 h-16 object-cover"
                />
              </TableCell>
              <TableCell className="py-4 text-black">
                {busTypeLabels[bus.type]}
              </TableCell>
              <TableCell className="py-4 text-black">
                {bus.licensePlate}
              </TableCell>
              <TableCell className="py-4 pr-4 text-black">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => openSaveDialog(bus)}
                    className="h-10 w-10 flex items-center justify-center rounded-md bg-black cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="w-6 h-6 text-white"
                      size="lg"
                    />
                  </button>
                  <button
                    onClick={() => deleteBus(bus.id)}
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
