import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

export default function UserHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container max-w-[1200px] mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faBus} size="2x" className="text-blue-600" />
            <p className="text-xl">Bus booking</p>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Popover>
            <PopoverTrigger>
              <div className="flex gap-3 items-center cursor-pointer">
                <FontAwesomeIcon icon={faPhoneVolume} size="xl" />
                <p className="font-medium text-lg hidden sm:block">
                  Hotline 24/7
                </p>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 px-0 py-0">
              <div className="flex flex-col">
                <p className="w-full p-3 py-3 ">
                  1999999 - Phản hồi dịch vụ và sự cố
                </p>
                <p className="w-full p-3 py-3 ">
                  1666666 - Đặt vé qua điện thoại (24/7)
                </p>
              </div>
            </PopoverContent>
          </Popover>
          <Link
            href="/login"
            className={cn(
              "bg-red-500 text-white font-light text-lg px-6 py-3",
              "rounded-xl tracking-wider leading-none cursor-pointer"
            )}
            title="Search Order"
          >
            Đăng nhập
          </Link>
        </nav>
      </div>
    </header>
  );
}
