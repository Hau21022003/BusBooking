"use client";
import StationPicker from "@/app/(user)/stations/components/StationPicker";

export default function Page() {
  const setValue = (coords) => {
    console.log("coords", coords);
  };
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tạo trạm mới</h1>
      <StationPicker
        station={{ lat: 21.0278, lng: 105.8342 }}
        onChange={(coords) => setValue(coords)}
      />
      {/* <StationPicker onChange={(coords) => setValue(coords)} /> */}
    </main>
  );
}
