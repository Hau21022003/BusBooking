"use client";
import { Station } from "@/types/station.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { handleErrorApi } from "@/lib/error";
import { useRouter } from "next/navigation";
import { stationApiRequest } from "@/api-requests/station";
interface StationTableProps {
  stationList: Station[];
  handleOpenDialog: (station?: Station) => void;
}
export default function StationTable({
  handleOpenDialog,
  stationList,
}: StationTableProps) {
  const router = useRouter();
  const deleteStation = async (id: number) => {
    try {
      await stationApiRequest.delete(id);
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
              Tên trạm
            </TableHead>
            <TableHead className="font-medium text-gray-600  hidden sm:table-cell">
              Địa chỉ
            </TableHead>
            <TableHead className="font-medium text-gray-600 text-right rounded-tr-md rounded-br-md">
              Xử lý
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          {stationList.map((station) => (
            <TableRow
              key={station.id}
              className={`py-4 border-b border-gray-200`}
            >
              <TableCell className="py-4 pl-4 text-black">
                {station.name}
              </TableCell>
              <TableCell className="py-4 text-black">
                {station.fullAddress}
              </TableCell>
              <TableCell className="py-4 pr-4 text-black">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenDialog(station)}
                    className="h-10 w-10 flex items-center justify-center rounded-md bg-black cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="w-6 h-6 text-white"
                      size="lg"
                    />
                  </button>
                  <button
                    onClick={() => deleteStation(station.id)}
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
