// bus-page.tsx
"use client";
import BusTable from "@/app/admin/bus-list/components/bus-table";
import SaveDialog from "@/app/admin/bus-list/components/save-dialog";
import { useSaveBusDialog } from "@/app/admin/bus-list/hooks/useSaveBusDialog";
import { cn } from "@/lib/utils";
import { Bus } from "@/types/bus.type";
import React from "react";

export default function BusPage({ busList }: { busList: Bus[] }) {
  const { selectedBus, handleCloseDialog, handleOpenDialog, openSaveDialog } =
    useSaveBusDialog();
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        {/* Header */}
        <div
          className={cn(
            "flex flex-col gap-4 md:flex-row md:justify-between md:items-center",
            "bg-white rounded-md p-3 px-6"
          )}
        >
          <p className="tracking-wider text-xl leading-none">Xe khách</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenDialog()}
              className="px-4 py-3 leading-none text-sm font-medium bg-black text-white rounded-md cursor-pointer"
            >
              Thêm mới
            </button>
          </div>
        </div>
        <BusTable busList={busList} openSaveDialog={handleOpenDialog} />
        <SaveDialog
          open={openSaveDialog}
          onClose={handleCloseDialog}
          selectedBus={selectedBus}
        />
      </div>
    </div>
  );
}
