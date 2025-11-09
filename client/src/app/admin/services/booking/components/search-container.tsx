"use client";
import { FindAllInput, FindAllSchema } from "@/schemas/booking.schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faPhone, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  bookingStatusMap,
  PaymentStatus,
  paymentStatusMap,
} from "@/enums/booking.enum";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface SearchContainerProps {
  params: FindAllInput;
}
export default function SearchContainer({ params }: SearchContainerProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(FindAllSchema),
    defaultValues: params,
  });
  const search = (data: FindAllInput) => {
    const values = form.getValues();

    const filteredEntries = Object.entries(values).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    );

    const query = new URLSearchParams(
      filteredEntries as [string, string][]
    ).toString();

    router.push(`?${query}`);
  };

  const searchParams = useSearchParams();
  const getBaseParams = (...excludes: (keyof FindAllInput)[]) => {
    const query = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (!excludes.includes(key as keyof FindAllInput)) {
        query.append(key, value);
      }
    });

    return query.toString();
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <div className="cursor-pointer w-10 h-10 flex items-center justify-center border rounded-md bg-gray-300 ">
            <FontAwesomeIcon icon={faFilter} size="lg" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="sm:min-w-96 w-auto overflow-hidden flex flex-col gap-4"
        >
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(
                (data) => {
                  search(data);
                },
                (errors) => {
                  console.log("error", errors);
                }
              )}
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Số điện thoại</FormLabel>
                    <Input
                      className="bg-white"
                      placeholder="Nhập số điện thoại"
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Trạng thái thanh toán</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trạng thái thanh toán" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value="">— Tất cả —</SelectItem> */}
                        {Object.entries(paymentStatusMap).map(
                          ([key, paymentLabel]) => (
                            <SelectItem key={key} value={key}>
                              {paymentLabel}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bookingStatus"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Trạng thái đặt vé</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trạng thái đặt vé" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(bookingStatusMap).map(
                          ([key, bookingStatusLabel]) => (
                            <SelectItem key={key} value={key}>
                              {bookingStatusLabel}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="cursor-pointer leading-none w-full sm:w-fit py-[10px] px-4 bg-black rounded-md text-white font-medium text-sm"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
      {params.phone && (
        <div className="px-3 h-10 flex items-center gap-2 rounded-md bg-gray-300">
          <FontAwesomeIcon icon={faPhone} size="lg" className="w-5 h-5" />
          <p className="max-w-32 line-clamp-1 leading-none">{params.phone}</p>
          <Link
            href={`?${getBaseParams("pageNumber", "phone")}`}
            className="cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              className="pl-2 w-4 h-4"
            />
          </Link>
        </div>
      )}
      {params.paymentStatus && (
        <div className="px-3 h-10 flex items-center gap-2 rounded-md bg-gray-300">
          <p className="max-w-32 line-clamp-1 leading-none">
            {paymentStatusMap[params.paymentStatus]}
          </p>
          <Link
            href={`?${getBaseParams("pageNumber", "phone")}`}
            className="cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              className="pl-2 w-4 h-4"
            />
          </Link>
        </div>
      )}
      {params.bookingStatus && (
        <div className="px-3 h-10 flex items-center gap-2 rounded-md bg-gray-300">
          <p className="max-w-32 line-clamp-1 leading-none">
            Trạng thái: {bookingStatusMap[params.bookingStatus]}
          </p>
          <Link
            href={`?${getBaseParams("pageNumber", "phone")}`}
            className="cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              className="pl-2 w-4 h-4"
            />
          </Link>
        </div>
      )}
    </div>
  );
}
