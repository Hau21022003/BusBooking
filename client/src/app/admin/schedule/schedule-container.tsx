"use client";
import SaveDialog from "@/app/admin/schedule/components/save-dialog";
import ScheduleTable from "@/app/admin/schedule/components/schedule-table";
import { useSaveDialog } from "@/hooks/use-save-dialog";
import { cn } from "@/lib/utils";
import { Bus } from "@/types/bus.type";
import { Route } from "@/types/route.type";
import { Schedule } from "@/types/schedule.type";
import React from "react";

interface ScheduleContainerProps {
  schedules: Schedule[];
  busList: Bus[];
  routes: Route[];
}

export default function ScheduleContainer({
  schedules,
  busList,
  routes,
}: ScheduleContainerProps) {
  const { handleClose, handleOpen, open, selected } = useSaveDialog<Schedule>();
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        <div
          className={cn(
            "flex gap-4 flex-row justify-between items-center",
            "bg-white rounded-md p-3 px-6"
          )}
        >
          <p className="tracking-wider text-xl leading-none">Lịch trình</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpen()}
              className="px-4 py-3 leading-none text-sm font-medium bg-black text-white rounded-md cursor-pointer"
            >
              Thêm mới
            </button>
          </div>
        </div>
        <ScheduleTable openSaveDialog={handleOpen} schedules={schedules} />
        <SaveDialog
          open={open}
          onClose={handleClose}
          selectedSchedule={selected}
          busList={busList}
          routes={routes}
        />
      </div>
    </div>
  );
}
