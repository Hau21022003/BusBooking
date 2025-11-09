"use client";
import { userApiRequest } from "@/api-requests/user";
import { useUserStore } from "@/app/admin/users/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleLabels } from "@/enums/user-role.enum";
import { useUploadFile } from "@/hooks/use-upload-file";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import {
  CreateAccountInput,
  CreateAccountSchema,
} from "@/schemas/account.schema";
import {
  faCloudArrowUp,
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function SaveDialog() {
  const [showPassword, setShowPassword] = useState(false);
  const route = useRouter();
  const { closeSaveUser, isSaveOpen, selectedUser } = useUserStore();
  const form = useForm({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {},
  });
  const saveUser = async (data: CreateAccountInput) => {
    try {
      if (selectedUser) {
        await userApiRequest.update(selectedUser.id, data);
      } else {
        await userApiRequest.create(data);
      }
      closeSaveUser();
      route.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const { isUpLoading, fileInputRef, handleFileChange, openFileDialog } =
    useUploadFile();

  return (
    <Dialog open={isSaveOpen} onOpenChange={closeSaveUser}>
      <DialogContent className="overflow-y-auto max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {selectedUser ? "Sửa" : "Tạo mới"} người dùng
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="h-full flex-1 flex flex-col space-y-4"
            onSubmit={form.handleSubmit(
              (data) => {
                saveUser(data);
              },
              (errors) => {
                console.log("error", errors);
              }
            )}
          >
            <div className="flex items-stretch gap-4">
              <div
                className={cn(
                  "w-38 h-38 cursor-pointer rounded-lg flex items-center justify-center overflow-hidden relative",
                  form.watch("avatar")
                    ? ""
                    : "border-2 border-gray-300 border-dashed"
                )}
                onClick={openFileDialog}
              >
                {form.watch("avatar") && (
                  <div className="h-full w-full relative group overflow-hidden">
                    <Image
                      alt=""
                      width={38}
                      height={38}
                      src={form.watch("avatar") || ""}
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
                {!form.watch("avatar") && !isUpLoading && (
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
                    if (imageUrl) form.setValue("avatar", imageUrl);
                  });
                }}
                hidden
              />
              <div className="flex-1 flex gap-4 flex-col items-start">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full">
                      <FormLabel>Tên người dùng</FormLabel>
                      <Input
                        className="bg-white"
                        placeholder="Nhập tên người dùng"
                        {...field}
                      />
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full">
                      <FormLabel>Số điện thoại</FormLabel>
                      <Input
                        className="bg-white"
                        placeholder="Vd: 033333333..."
                        {...field}
                      />
                      <FormMessage className="text-start" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>Email</FormLabel>
                  <Input
                    className="bg-white"
                    placeholder="Vd: 033333333..."
                    {...field}
                  />
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <FontAwesomeIcon icon={faEyeSlash} size="lg" />
                        ) : (
                          <FontAwesomeIcon icon={faEye} size="lg" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>Vai trò</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([key, roleLabel]) => (
                        <SelectItem key={key} value={key}>
                          {roleLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex gap-4 items-center">
                    <div
                      onClick={() => field.onChange(true)}
                      className={cn(
                        "flex-1 h-9 flex items-center px-4 font-medium text-sm cursor-pointer",
                        "border rounded-md border-gray-300 bg-gray-50",
                        field.value && "bg-blue-50 border-blue-400"
                      )}
                    >
                      Hoạt động
                    </div>
                    <div
                      onClick={() => field.onChange(false)}
                      className={cn(
                        "flex-1 h-9 flex items-center px-4 font-medium text-sm cursor-pointer",
                        "border rounded-md border-gray-300 bg-gray-50",
                        !field.value && "bg-blue-50 border-blue-400"
                      )}
                    >
                      Không hoạt động
                    </div>
                  </div>
                  <FormMessage className="text-start" />
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
