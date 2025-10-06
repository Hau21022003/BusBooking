import { TimeRangeSlider } from "@/app/(user)/home/components/filter-sidebar/time-range-slider";
import { HomePageParams } from "@/app/(user)/home/page";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BusType, busTypeMap } from "@/enums/bus.enum";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function FilterSidebar({ params }: { params: HomePageParams }) {
  const getBaseParams = (...excludes: (keyof HomePageParams)[]) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        !excludes.includes(key as keyof HomePageParams) &&
        value !== undefined
      ) {
        query.append(key, String(value));
      }
    });

    return query.toString();
  };
  return (
    <div className="w-full lg:w-72 space-y-6 ">
      <Collapsible className="space-y-2" open={true}>
        <CollapsibleTrigger asChild>
          <div className={cn("flex items-center gap-3 cursor-pointer")}>
            <p className={` text-xl font-bold uppercase`}>Giờ khởi hành</p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-1 mt-6">
          <TimeRangeSlider />
        </CollapsibleContent>
      </Collapsible>

      <div
        className="border-t-2 border-black"
        style={{
          borderStyle: "dashed",
          borderImage:
            "repeating-linear-gradient(to right, black 0, black 8px, transparent 8px, transparent 16px) 1",
        }}
      />

      <Collapsible className="space-y-2 " open={true}>
        <CollapsibleTrigger asChild>
          <div className={cn("flex items-center gap-3 cursor-pointer")}>
            <p className={` text-xl font-bold uppercase`}>Loại xe</p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-1 mt-4">
          {Object.entries(BusType).map(([key, value]) => {
            const checked = params.busType === value;
            const baseParams = getBaseParams("busType");
            const newParams = checked
              ? baseParams
              : `${baseParams}&busType=${value}`;
            return (
              <Link key={key} href={`?${newParams}`}>
                <div
                  className={`px-4 py-[4px] flex items-center justify-between cursor-pointer ${
                    checked ? "bg-gray-200" : "hover:bg-gray-200"
                  }`}
                >
                  <span className="truncate">{busTypeMap[value]}</span>
                  <button className={`${checked ? "" : "hidden"}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
