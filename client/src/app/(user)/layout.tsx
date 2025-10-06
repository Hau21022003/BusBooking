import UserHeader from "@/app/(user)/header";
import React from "react";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-auto h-full">
      <UserHeader />
      <main
        className="bg-gray-50 flex-1"
        style={{ scrollbarGutter: "stable both-edges" }}
      >
        {children}
      </main>
    </div>
  );
}
