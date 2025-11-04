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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/error";
import { busApiRequest } from "@/api-requests/bus";
import { revalidateApiRequest } from "@/api-requests/revalidate";
import Image from "next/image";

export default function BusTable({
  busList,
  openSaveDialog,
}: {
  busList: Bus[];
  openSaveDialog: (selectedBus?: Bus) => void;
}) {
  const router = useRouter();

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
              Mẫu xe
            </TableHead>
            <TableHead className="font-medium text-gray-600 ">
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
                <div className="flex items-center gap-4">
                  <Image
                    alt={bus.licensePlate}
                    src={bus.busModel?.imageUrl || ""}
                    width={40}
                    height={40}
                    className="w-16 h-16 object-cover"
                  />
                  <p className="leading-none">{bus.busModel?.name}</p>
                </div>
              </TableCell>
              <TableCell className="py-4 text-black">
                {bus.licensePlate}
              </TableCell>
              <TableCell className="py-4 text-black">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => openSaveDialog(bus)}
                    className="cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="w-6 h-6 "
                      size="lg"
                    />
                  </button>
                  <button
                    onClick={() => deleteBus(bus.id)}
                    className="cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="w-6 h-6 "
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
