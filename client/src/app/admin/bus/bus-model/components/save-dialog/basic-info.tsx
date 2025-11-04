import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUploadFile } from "@/hooks/use-upload-file";
import { cn } from "@/lib/utils";
import { CreateBusModel } from "@/schemas/bus-model.schema";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { Fragment } from "react";
import { UseFormReturn } from "react-hook-form";

export default function BasicInfo({
  form,
}: {
  form: UseFormReturn<CreateBusModel>;
}) {
  const { isUpLoading, fileInputRef, handleFileChange, openFileDialog } =
    useUploadFile();
  return (
    <Fragment>
      <div className="flex items-stretch gap-4">
        <div
          className={cn(
            "w-38 h-38 cursor-pointer rounded-lg flex items-center justify-center overflow-hidden relative",
            form.watch("imageUrl")
              ? ""
              : "border-2 border-gray-300 border-dashed"
          )}
          onClick={openFileDialog}
        >
          {form.watch("imageUrl") && (
            <div className="h-full w-full relative group overflow-hidden">
              <Image
                alt=""
                width={38}
                height={38}
                src={form.watch("imageUrl") || ""}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <FontAwesomeIcon
                  size="4x"
                  className="w-7 h-7 text-white"
                  icon={faCloudArrowUp}
                />
              </div>
            </div>
          )}
          {!form.watch("imageUrl") && !isUpLoading && (
            <FontAwesomeIcon
              size="4x"
              className="w-7 h-7 text-gray-400"
              icon={faCloudArrowUp}
            />
          )}
          {isUpLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <Loader2 className="text-black h-10 w-10 animate-spin" />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const imageUrlPromise = handleFileChange(e);
            imageUrlPromise.then((imageUrl) => {
              if (imageUrl) form.setValue("imageUrl", imageUrl);
            });
          }}
          hidden
        />
        <div className="flex-1 flex gap-4 flex-col items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-1 w-full">
                <FormLabel>Tên xe</FormLabel>
                <Input
                  className="bg-white"
                  placeholder="Nhập tên xe"
                  {...field}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-1 w-full">
                <FormLabel>Mô tả</FormLabel>
                <Input
                  className="bg-white"
                  placeholder="Nhập mô tả"
                  {...field}
                />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Fragment>
  );
}
