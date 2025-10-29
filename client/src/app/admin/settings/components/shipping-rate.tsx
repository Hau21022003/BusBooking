import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ShippingRateSetting,
  ShippingRateSettingSchema,
} from "@/schemas/settings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/error";
import { settingsApiRequest } from "@/api-requests/settings";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShippingRateProps {
  shippingRate?: number;
}
export default function ShippingRate({ shippingRate }: ShippingRateProps) {
  const form = useForm({
    resolver: zodResolver(ShippingRateSettingSchema),
    defaultValues: {
      value: shippingRate,
    },
  });
  const saveShippingRate = async (data: ShippingRateSetting) => {
    try {
      await settingsApiRequest.set(data);
      toast.success("Thành công", {
        description: "Cập nhật phí vận chuyển thành công",
        duration: 3000,
      });
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <div className="rounded-lg bg-white p-5 flex flex-col gap-4 md:flex-row md:gap-10">
      <div className="md:w-96 space-y-1">
        <p className="font-medium">Phí vận chuyển mỗi kg</p>
        <p className="text-sm text-gray-400">
          Mức phí tính cho mỗi kilogram hàng hóa. Dùng để tính tổng phí vận
          chuyển khi thanh toán.
        </p>
      </div>
      <Form {...form}>
        <form
          className="flex-1 flex flex-col gap-2 lg:flex-row items-start space-y-1"
          onSubmit={form.handleSubmit(
            (data) => {
              saveShippingRate(data);
            },
            (errors) => {
              console.log("error", errors);
            }
          )}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <FormItem className="flex-1 w-full lg:w-auto">
                <div className="relative overflow-hidden rounded-md">
                  <Input
                    inputMode="numeric"
                    className={cn(
                      "bg-white pr-10",
                      fieldState.invalid &&
                        "border-red-500 focus-visible:ring-red-300"
                    )}
                    placeholder="Phí vận chuyển / kg"
                    value={
                      field.value
                        ? field.value.toLocaleString("vi-VN", {
                            currency: "VND",
                          })
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/[^\d]/g, ""); // bỏ ký tự không phải số
                      const numericValue = rawValue
                        ? parseInt(rawValue, 10)
                        : 0;
                      field.onChange(numericValue);
                    }}
                  />
                  <div
                    className={cn(
                      "absolute right-[2px] rounded-r-sm top-1/2 -translate-y-1/2 text-gray-500",
                      "bg-gray-300 h-8 aspect-square flex items-center justify-center"
                    )}
                  >
                    <p className="leading-none text-sm font-medium">đ</p>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            type="submit"
            className="w-full sm:w-auto text-sm font-medium py-2 px-4 rounded-md bg-black text-white"
          >
            Cập nhật
          </button>
        </form>
      </Form>
    </div>
  );
}
