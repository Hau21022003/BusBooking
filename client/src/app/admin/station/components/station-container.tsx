"use client";
import SaveDialog from "@/app/admin/station/components/save-dialog";
import StationTable from "@/app/admin/station/components/station-table";
import { useSaveDialog } from "@/hooks/use-save-dialog";
import { cn } from "@/lib/utils";
import { Province } from "@/types/province.type";
import { Station } from "@/types/station.type";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface StationContainerProps {
  stationList: Station[];
  provinceList: Province[];
}
export default function StationContainer({
  provinceList,
  stationList,
}: StationContainerProps) {
  const { open, selected, handleClose, handleOpen } = useSaveDialog<Station>();
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        <div
          className={cn(
            "flex flex-col gap-4 md:flex-row md:justify-between md:items-center",
            "bg-white rounded-md p-3 px-6"
          )}
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              className="w-6 h-6"
              size="lg"
              icon={faLocationDot}
            />
            <p className="text-xl leading-none">Trạm xe</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpen()}
              className="px-4 py-3 leading-none text-sm font-medium bg-black text-white rounded-md cursor-pointer"
            >
              Thêm mới
            </button>
          </div>
        </div>
        <StationTable handleOpenDialog={handleOpen} stationList={stationList} />
        <SaveDialog
          provinceList={provinceList}
          open={open}
          onClose={handleClose}
          selectedStation={selected}
        />
      </div>
    </div>
  );
}
