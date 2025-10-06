"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { useHomeStore } from "@/app/(user)/home/store";

function formatTime(value: number) {
  const totalMinutes = value * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(
    2,
    "0"
  )}`;
}

export function TimeRangeSlider() {
  const { setTimeRange, timeRange } = useHomeStore();
  const [activeThumb, setActiveThumb] = React.useState<number | null>(null);
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <SliderPrimitive.Root
        value={timeRange}
        onValueChange={setTimeRange}
        min={0}
        max={48}
        step={1}
        className="relative flex w-full touch-none select-none items-center"
      >
        {/* Track */}
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>

        {/* Two thumbs */}
        {timeRange.map((v, i) => (
          <SliderPrimitive.Thumb
            key={i}
            onPointerDown={() => setActiveThumb(i)}
            onPointerUp={() => setActiveThumb(null)}
            className={cn(
              "relative block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {activeThumb === i && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: -8 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs shadow-sm"
                >
                  {formatTime(v)}
                </motion.div>
              )}
            </AnimatePresence>
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>

      {/* Hiển thị giá trị bên dưới */}
      <div className="text-base flex items-center gap-2 mt-2">
        <p className="p-2 rounded-sm border border-gray-300 leading-none">
          {formatTime(timeRange[0])}
        </p>
        <FontAwesomeIcon icon={faMinus} size="sm" />
        <p className="p-2 rounded-sm border border-gray-300 leading-none">
          {formatTime(timeRange[1])}
        </p>
      </div>
    </div>
  );
}
