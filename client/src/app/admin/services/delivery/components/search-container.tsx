"use client";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SearchContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  useEffect(() => {
    const searchValue = searchParams.get("search");
    if (searchValue) {
      setSearch(searchValue);
    }
  }, [searchParams]);

  const handleSearch = () => {
    const query = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "search" && value !== undefined) {
        query.append(key, String(value));
      }
    });
    router.push(`?${query.toString()}&search=${search ? search : ""}`);
    router.refresh();
  };
  return (
    <div className="flex gap-2 items-stretch">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 max-w-2xl bg-white"
        placeholder="Nhập tên, SDT của người gửi - nhận"
      />
      <button
        onClick={handleSearch}
        className="leading-none px-4 rounded-md text-sm font-medium flex items-center bg-black text-white"
      >
        Tìm kiếm
      </button>
    </div>
  );
}
