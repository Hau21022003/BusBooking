import { deliveryApiRequest } from "@/api-requests/delivery";
import DeliveryTable from "@/app/admin/services/delivery/components/delivery-table";
import SearchContainer from "@/app/admin/services/delivery/components/search-container";
import { buildPaginatedMeta } from "@/lib/pagination";
import React from "react";

interface DeliverySearchParams {
  search: string;
  pageNumber?: string;
}

interface DeliveryPageProps {
  searchParams: DeliverySearchParams;
}
export default async function DeliveryPage({
  searchParams,
}: DeliveryPageProps) {
  const { search, pageNumber } = await searchParams;
  const { deliveries, total } = await deliveryApiRequest
    .findAll({
      search: search ? search : undefined,
      pageNumber: pageNumber ? Number(pageNumber) : undefined,
    })
    .then((res) => ({ deliveries: res.payload.data, total: res.payload.total }))
    .catch((e) => {
      console.log("deliveryApiRequest", e);
      return { deliveries: [], total: 0 };
    });
  const pageMeta = buildPaginatedMeta({
    pageNumber: Number(pageNumber) || 1,
    pageSize: 10,
    total: total,
  });
  return (
    <div className="space-y-4">
      <SearchContainer />
      <DeliveryTable deliveries={deliveries} pageMeta={pageMeta} />
    </div>
  );
}
