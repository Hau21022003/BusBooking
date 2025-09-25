import SeatIcon from "@/components/icon/seat-icon";

export default function Home() {
  return (
    <div className="bg-gray-600 h-screen">
      <SeatIcon size={70} />
      <SeatIcon size={70} variant="head" />
      <SeatIcon size={70} variant="middle" />
      <SeatIcon size={70} variant="end" />
      <SeatIcon size={70} variant="selected" />
      <SeatIcon size={70} variant="disabled" />
    </div>
  );
}
