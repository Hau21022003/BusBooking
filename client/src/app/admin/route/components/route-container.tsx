"use client";
import RouteTable from "@/app/admin/route/components/route-table";
import SaveDialog from "@/app/admin/route/components/save-dialog";
import { useSaveDialog } from "@/hooks/use-save-dialog";
import { cn } from "@/lib/utils";
import { Route } from "@/types/route.type";
import { Station } from "@/types/station.type";
import React from "react";

interface RouteContainerProps {
  routeList: Route[];
  stations: Station[];
}
export default function RouteContainer({
  routeList,
  stations,
}: RouteContainerProps) {
  const { handleClose, handleOpen, open, selected } = useSaveDialog<Route>();
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        <div
          className={cn(
            "flex gap-4 flex-row justify-between items-center",
            "bg-white rounded-md p-3 px-6"
          )}
        >
          <p className="tracking-wider text-xl leading-none">Tuyến đường</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpen()}
              className="px-4 py-3 leading-none text-sm font-medium bg-black text-white rounded-md cursor-pointer"
            >
              Thêm mới
            </button>
          </div>
        </div>
        <RouteTable routeList={routeList} openSaveDialog={handleOpen} />
        <SaveDialog
          open={open}
          onClose={handleClose}
          selectedRoute={selected}
          stations={stations}
        />
      </div>
    </div>
  );
}
