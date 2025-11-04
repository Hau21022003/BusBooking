import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BusModel } from "@/types/bus-model.type";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateBusModel,
  createBusModelSchema,
} from "@/schemas/bus-model.schema";
import { handleErrorApi } from "@/lib/error";
import { busModelApiRequest } from "@/api-requests/bus-model";
import BasicInfo from "@/app/admin/bus/bus-model/components/save-dialog/basic-info";
import SeatLayout from "@/app/admin/bus/bus-model/components/save-dialog/seat-layout";
import { toast } from "sonner";

interface SaveDialogProps {
  open: boolean;
  onClose: () => void;
  selectedBusModel?: BusModel;
}

export default function SaveDialog({
  onClose,
  open,
  selectedBusModel,
}: SaveDialogProps) {
  const route = useRouter();
  const form = useForm({
    resolver: zodResolver(createBusModelSchema),
    defaultValues: { seatLayout: { seats: [] }, description: "" },
  });

  const saveBusModel = async (data: CreateBusModel) => {
    if (!data.imageUrl) {
      toast.error("Lỗi", {
        duration: 3000,
        description: "Hình ảnh xe khách bị trống",
      });
      return;
    }
    try {
      if (selectedBusModel) {
        await busModelApiRequest.update(selectedBusModel.id, data);
      } else {
        await busModelApiRequest.create(data);
      }
      form.reset({ seatLayout: { seats: [] }, description: "" });
      onClose();
      route.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  useEffect(() => {
    if (selectedBusModel) form.reset(selectedBusModel);
    else form.reset({ description: "" });
  }, [selectedBusModel]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {selectedBusModel ? "Sửa" : "Tạo mới"} mẫu xe
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="h-full flex-1 flex flex-col space-y-4"
            onSubmit={form.handleSubmit(
              (data) => {
                saveBusModel(data);
              },
              (errors) => {
                console.log("error", errors);
              }
            )}
          >
            <BasicInfo form={form} />
            <SeatLayout form={form} />
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
