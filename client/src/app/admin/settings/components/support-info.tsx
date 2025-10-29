import { settingsApiRequest } from "@/api-requests/settings";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import {
  SupportEmailSetting,
  SupportEmailSettingSchema,
  SupportPhoneSetting,
  SupportPhoneSettingSchema,
} from "@/schemas/settings.schema";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SupportInfoProps {
  supportEmail?: string;
  supportPhone?: string;
}
export default function SupportInfo({
  supportEmail,
  supportPhone,
}: SupportInfoProps) {
  const supportEmailForm = useForm({
    resolver: zodResolver(SupportEmailSettingSchema),
    defaultValues: {
      value: supportEmail,
    },
  });

  const supportPhoneForm = useForm({
    resolver: zodResolver(SupportPhoneSettingSchema),
    defaultValues: {
      value: supportPhone,
    },
  });

  const saveSupportEmail = async (data: SupportEmailSetting) => {
    try {
      await settingsApiRequest.set(data);
      toast.success("Thành công", {
        description: "Cập nhật email hỗ trợ thành công",
        duration: 3000,
      });
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const saveSupportPhone = async (data: SupportPhoneSetting) => {
    try {
      await settingsApiRequest.set(data);
      toast.success("Thành công", {
        description: "Cập nhật SDT hỗ trợ thành công",
        duration: 3000,
      });
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const handleSubmitBoth = async () => {
    await supportEmailForm.handleSubmit(
      (data) => saveSupportEmail(data),
      (errors) => console.log("Email form errors", errors)
    )();

    await supportPhoneForm.handleSubmit(
      (data) => saveSupportPhone(data),
      (errors) => console.log("Phone form errors", errors)
    )();
  };

  return (
    <div className="rounded-lg bg-white p-5 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:gap-10">
        <div className="md:w-96 space-y-1">
          <p className="font-medium">Email hỗ trợ</p>
          <p className="text-sm text-gray-400">
            Địa chỉ email mà khách hàng có thể liên hệ khi cần hỗ trợ hoặc có
            thắc mắc.
          </p>
        </div>
        <Form {...supportEmailForm}>
          <form
            className="flex-1"
            onSubmit={supportEmailForm.handleSubmit(
              (data) => {
                saveSupportEmail(data);
              },
              (errors) => {
                console.log("error", errors);
              }
            )}
          >
            <FormField
              control={supportEmailForm.control}
              name="value"
              render={({ field, fieldState }) => (
                <FormItem className="flex-1 w-full lg:w-auto">
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      size="lg"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                    />

                    <Input
                      type="email"
                      className={cn(
                        "bg-white pl-12",
                        fieldState.invalid &&
                          "border-red-500 focus-visible:ring-red-300"
                      )}
                      placeholder="Nhập email hỗ trợ"
                      {...field}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-10">
        <div className="md:w-96 space-y-1">
          <p className="font-medium">Số điện thoại hỗ trợ</p>
          <p className="text-sm text-gray-400">
            Số điện thoại để khách hàng có thể gọi khi cần được giúp đỡ.
          </p>
        </div>
        <Form {...supportPhoneForm}>
          <form
            className="flex-1"
            onSubmit={supportPhoneForm.handleSubmit(
              (data) => {
                saveSupportPhone(data);
              },
              (errors) => {
                console.log("error", errors);
              }
            )}
          >
            <FormField
              control={supportPhoneForm.control}
              name="value"
              render={({ field, fieldState }) => (
                <FormItem className="flex-1 w-full lg:w-auto">
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faPhone}
                      size="lg"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                    />

                    <Input
                      className={cn(
                        "bg-white pl-12",
                        fieldState.invalid &&
                          "border-red-500 focus-visible:ring-red-300"
                      )}
                      placeholder="Nhập email hỗ trợ"
                      {...field}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="flex justify-end">
        <button
          className="w-full sm:w-auto text-sm font-medium py-2 px-4 rounded-md bg-black text-white"
          onClick={handleSubmitBoth}
        >
          Cập nhật thông tin
        </button>
      </div>
    </div>
  );
}
