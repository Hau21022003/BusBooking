"use client";
/* eslint-disable @next/next/no-img-element */
import { Bus } from "@/types/bus.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CreateBus, createBusSchema } from "@/schemas/bus.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { handleErrorApi } from "@/lib/error";
import { busApiRequest } from "@/api-requests/bus";
import { revalidateApiRequest } from "@/api-requests/revalidate";
import { useRouter } from "next/navigation";
import { BusModel } from "@/types/bus-model.type";
import Combobox from "@/components/combobox";

export default function SaveDialog({
  open,
  onClose,
  selectedBus,
  busModelList,
}: {
  open: boolean;
  onClose: () => void;
  selectedBus?: Bus;
  busModelList: BusModel[];
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createBusSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (selectedBus) form.reset(selectedBus);
    else form.reset({});
  }, [selectedBus]);

  const saveBus = async (data: CreateBus) => {
    try {
      if (selectedBus) {
        await busApiRequest.update(selectedBus.id, data);
      } else {
        await busApiRequest.create(data);
      }
      await revalidateApiRequest("bus");
      onClose();
      form.reset({});
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>{selectedBus ? "Sửa" : "Tạo mới"} xe khách</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(
              (data) => {
                saveBus(data);
              },
              (errors) => {
                console.log("error", errors);
              }
            )}
          >
            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-1 w-full">
                  <FormLabel>Biển số</FormLabel>
                  <Input
                    className="bg-white"
                    placeholder="VD: 30A-123.45"
                    {...field}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="busModelId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1 space-y-1 w-full">
                  <FormLabel>Mẫu xe</FormLabel>
                  <Combobox
                    options={busModelList.map((busModel) => ({
                      label: busModel.name,
                      value: busModel.id.toString(),
                    }))}
                    value={field.value?.toString()}
                    placeholder="Chọn mẫu xe"
                    onChange={(value) => {
                      if (value) field.onChange(Number(value));
                      else field.onChange(undefined);
                    }}
                    className={cn("w-full")}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="cursor-pointer leading-none w-full sm:w-fit py-3 px-4 bg-black rounded-md text-white font-medium text-sm"
              >
                Lưu
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
