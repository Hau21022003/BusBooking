"use client";
import BusModelTable from "@/app/admin/bus/bus-model/components/bus-model-table";
import SaveDialog from "@/app/admin/bus/bus-model/components/save-dialog";
import { useSaveDialog } from "@/hooks/use-save-dialog";
import { cn } from "@/lib/utils";
import { BusModel } from "@/types/bus-model.type";
import React from "react";

interface BusModelPageContainerProps {
  busModels: BusModel[];
}
export default function BusModelPageContainer({
  busModels,
}: BusModelPageContainerProps) {
  const { handleOpen, handleClose, open, selected } = useSaveDialog<BusModel>();
  return (
    <div>
      <div className="sticky pb-4 bg-gray-50">
        <div
          className={cn(
            "flex gap-4 flex-row justify-between items-center",
            "bg-white rounded-md p-3 px-6"
          )}
        >
          <p className="tracking-wider text-xl leading-none">Mẫu xe</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpen()}
              className="px-4 py-3 leading-none text-sm font-medium bg-black text-white rounded-md cursor-pointer"
            >
              Thêm mới
            </button>
          </div>
        </div>
      </div>
      <BusModelTable busModels={busModels} openSaveDialog={handleOpen} />
      <SaveDialog
        onClose={handleClose}
        open={open}
        selectedBusModel={selected}
      />
    </div>
  );
}
