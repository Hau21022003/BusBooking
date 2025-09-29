import { Route } from "@/types/route.type";
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
import { routeApiRequest } from "@/api-requests/route-api";
import { handleErrorApi } from "@/lib/error";

interface RouteTableProps {
  routeList: Route[];
  openSaveDialog: (selectedRoute?: Route) => void;
}
export default function RouteTable({
  routeList,
  openSaveDialog,
}: RouteTableProps) {
  const router = useRouter();
  const deleteRoute = async (id: string) => {
    try {
      await routeApiRequest.delete(id);
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
              Tên tuyến đường
            </TableHead>
            <TableHead className="font-medium text-gray-600  hidden sm:table-cell">
              Các điểm dừng chân
            </TableHead>
            <TableHead className="font-medium text-gray-600 text-right rounded-tr-md rounded-br-md">
              Xử lý
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          {routeList.map((route) => (
            <TableRow
              key={route.id}
              className={`py-4 border-b border-gray-200 w-60 truncate`}
            >
              <TableCell className="py-4 pl-4 text-black">
                {route.name}
              </TableCell>
              <TableCell className="py-4 text-black max-w-60 truncate">
                {route.stops.reduce((result, stop, idx) => {
                  return idx !== 0 ? result + " -> " + stop.name : stop.name;
                }, "")}
              </TableCell>
              <TableCell className="py-4 pr-4 text-black">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => openSaveDialog(route)}
                    className="h-10 w-10 flex items-center justify-center rounded-md bg-black cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="w-6 h-6 text-white"
                      size="lg"
                    />
                  </button>
                  <button
                    onClick={() => deleteRoute(route.id)}
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
