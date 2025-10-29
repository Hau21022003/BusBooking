"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";

export type Option = {
  label: string;
  value: string;
};

interface ComboboxProps {
  options: Option[];
  value?: string | null;
  placeholder?: string;
  onChange?: (value: string | null) => void;
  className?: string;
  type?: "default" | "form";
  icon?: React.ReactNode;
}

export default function Combobox({
  options,
  value,
  placeholder = "Select option",
  onChange,
  className,
  type = "form",
  icon,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const handleSelect = (val: string) => {
    const newValue = val === value ? null : val;
    onChange?.(newValue);
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-[200px] justify-between items-center font-normal",
            className,
            !value && "text-muted-foreground"
          )}
        >
          {icon && <div className="shrink-0">{icon}</div>}
          <p
            className={cn(
              "text-start flex-1 truncate line-clamp-1",
              type == "default" && "text-base"
            )}
          >
            {value && value !== ""
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
          </p>
          <ChevronsUpDown
            className={cn(
              "shrink-0",
              (!value || value === "") && "opacity-50",
              type == "default" && "w-5 h-5"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("w-[--radix-popover-trigger-width] p-0")}
      >
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => handleSelect(opt.value)}
                >
                  {opt.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === opt.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
