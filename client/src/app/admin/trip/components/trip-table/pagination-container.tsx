import { useTripStore } from "@/app/admin/trip/store";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getVisiblePages } from "@/lib/pagination";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function PaginationContainer() {
  const pageMeta = useTripStore((state) => state.pageMeta);
  const searchParams = useSearchParams();
  const getBaseParams = () => {
    const query = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (key !== "pageNumber") query.append(key, value);
    });

    return query.toString();
  };

  const visiblePages = getVisiblePages({
    currentPage: pageMeta.pageNumber,
    totalPages: pageMeta.totalPages,
  });
  const baseParams = getBaseParams();

  return (
    visiblePages.length !== 0 && (
      <div className="w-full flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  baseParams
                    ? `?${baseParams}&pageNumber=${pageMeta.pageNumber - 1}`
                    : `?pageNumber=${pageMeta.pageNumber - 1}`
                }
                aria-disabled={!pageMeta.hasPrevPage}
                className={
                  !pageMeta.hasPrevPage ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {visiblePages.map((page, index) => (
              <PaginationItem key={`${page}-${index}`}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={
                      baseParams
                        ? `?${baseParams}&pageNumber=${page}`
                        : `?pageNumber=${page}`
                    }
                    isActive={page === pageMeta.pageNumber}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={
                  baseParams
                    ? `?${baseParams}&pageNumber=${pageMeta.pageNumber + 1}`
                    : `?pageNumber=${pageMeta.pageNumber + 1}`
                }
                aria-disabled={!pageMeta.hasNextPage}
                className={
                  !pageMeta.hasNextPage ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )
  );
}
