"use client";
import SaveDialog from "@/app/admin/users/components/save-dialog";
import { useUserStore } from "@/app/admin/users/store";
import { cn } from "@/lib/utils";
import React from "react";

export default function UsersContainer() {
  const { openSaveUser } = useUserStore();
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        <div
          className={cn(
            "flex gap-4 flex-row justify-between items-center",
            "bg-white rounded-md p-3 px-6"
          )}
        >
          <p className="tracking-wider text-xl leading-none">Nguời dùng</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => openSaveUser()}
              className="px-4 py-3 leading-none text-sm font-medium bg-black text-white rounded-md cursor-pointer"
            >
              Thêm mới
            </button>
          </div>
        </div>
        {/* <ScheduleTable openSaveDialog={handleOpen} schedules={schedules} /> */}
        <SaveDialog />
      </div>
    </div>
  );
}
