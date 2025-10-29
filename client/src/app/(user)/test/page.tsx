import DriverMap from "@/app/(user)/test/components/DriverMap";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Demo bản đồ tài xế (OSM + Leaflet)
      </h1>
      <p className="mb-4 text-gray-600">
        Ứng dụng hiển thị tuyến Hà Nội → Hải Phòng, vị trí hiện tại của tài xế
        (dựa vào GPS).
      </p>
      <DriverMap />
    </main>
  );
}
