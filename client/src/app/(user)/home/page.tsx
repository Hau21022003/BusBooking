import { busModelApiRequest } from "@/api-requests/bus-model";
import { routeApiRequest } from "@/api-requests/route-api";
import { tripApiRequest } from "@/api-requests/trip";
import FilterSidebar from "@/app/(user)/home/components/filter-sidebar";
import SearchContainer from "@/app/(user)/home/components/search-container";
import TripGrid from "@/app/(user)/home/components/trip-grid";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { z } from "zod";

const HomePageParamsSchema = z.object({
  date: z.string().datetime().optional(),
  routeId: z.string().optional(),
  busModelId: z.number().optional(),
  availableSeats: z.number().optional(),
});

export type HomePageParams = {
  date?: string;
  routeId?: string;
  busModelId?: number;
  availableSeats?: number;
};
interface HomePageProps {
  searchParams: HomePageParams;
}
export default async function HomePage({ searchParams }: HomePageProps) {
  const { date, routeId, busModelId, availableSeats } = await searchParams;

  const rawParams: HomePageParams = {
    date,
    routeId,
    busModelId: busModelId ? Number(busModelId) : undefined,
    availableSeats: availableSeats && Number(availableSeats),
  };

  const params = HomePageParamsSchema.safeParse(rawParams);
  if (!params.success) {
    console.error("Invalid query params");
  }

  const busModels = await busModelApiRequest
    .findAll()
    .then((res) => res.payload)
    .catch((e) => {
      console.log("busModelApiRequest: ", e);
      return [];
    });

  const trips = await tripApiRequest
    .findAllPublic({
      date: date ?? new Date().toISOString(),
      routeId: routeId || "",
      busModelId: busModelId && Number(busModelId),
      availableSeats: availableSeats && Number(availableSeats),
    })
    .then((res) => res.payload)
    .catch((err) => {
      console.error("tripApiRequest failed:", err);
      return [];
    });

  const routes = await routeApiRequest
    .find()
    .then((res) => res.payload)
    .catch((err) => {
      console.error("routeApiRequest failed:", err.message);
      return [];
    });

  return (
    <div className="container max-w-[1200px] mx-auto px-6 pt-6 space-y-6">
      <div className="shadow-md rounded-xl bg-white">
        <SearchContainer routes={routes} />
      </div>
      {date && routeId && (
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-10">
          <div className="hidden lg:block bg-white rounded-lg p-6 border border-gray-200">
            <FilterSidebar params={params.data || {}} busModels={busModels} />
          </div>

          <div className="lg:hidden flex justify-between items-center">
            <p className="text-xl leading-none font-medium">
              Kết quả: {trips.length} chuyến
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <button className="px-4 py-3 bg-white flex border border-gray-300 rounded-md items-center gap-2 cursor-pointer">
                  <p className="leading-none font-medium">Filter</p>
                  <FontAwesomeIcon icon={faSliders} size="sm" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-6 h-full overflow-y-auto">
                <FilterSidebar
                  params={params.data || {}}
                  busModels={busModels}
                />
              </SheetContent>
            </Sheet>
          </div>
          <div className="lg:flex-1 space-y-4">
            <p className="text-xl font-medium hidden lg:block">
              Kết quả: {trips.length} chuyến
            </p>
            <TripGrid trips={trips} />
          </div>
        </div>
      )}
    </div>
  );
}
