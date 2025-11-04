import { BusModel } from "@/types/bus-model.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { handleErrorApi } from "@/lib/error";
import { useRouter } from "next/navigation";
import { busModelApiRequest } from "@/api-requests/bus-model";

interface BusModelTableProps {
  busModels: BusModel[];
  openSaveDialog: (busModel?: BusModel) => void;
}
export default function BusModelTable({
  busModels,
  openSaveDialog,
}: BusModelTableProps) {
  const router = useRouter();

  const deleteBusModel = async (busModelId: number) => {
    try {
      await busModelApiRequest.delete(busModelId);
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <div className="p-4 rounded-md bg-white">
      <Table className="text-gray-500 overflow-hidden border-collapse">
        <TableBody className="text-base">
          {busModels.map((busModel) => (
            <TableRow
              key={busModel.id}
              className={`py-4 border-b border-gray-200`}
            >
              <TableCell className="py-4 text-black">
                <div className="flex items-center gap-4">
                  <Image
                    alt=""
                    src={busModel.imageUrl || ""}
                    width={40}
                    height={40}
                    className="w-16 h-16 object-cover"
                  />
                  <p className="leading-none">{busModel.name}</p>
                </div>
              </TableCell>
              <TableCell className="py-4 text-black">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => openSaveDialog(busModel)}
                    className="cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="w-6 h-6"
                      size="lg"
                    />
                  </button>
                  <button
                    onClick={() => deleteBusModel(busModel.id)}
                    className="cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="w-6 h-6"
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
