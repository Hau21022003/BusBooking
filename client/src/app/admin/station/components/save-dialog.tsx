import { Station } from "@/types/station.type";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateStation, createStationSchema } from "@/schemas/station.schema";
import { handleErrorApi } from "@/lib/error";
import { stationApiRequest } from "@/api-requests/station";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Combobox from "@/components/combobox";
import { District, Province, Ward } from "@/types/province.type";
import { provinceApiRequest } from "@/api-requests/province";
import { cn } from "@/lib/utils";
import StationPicker from "@/app/admin/station/components/station-picker";
import { toast } from "sonner";

interface SaveDialogProps {
  open: boolean;
  onClose: () => void;
  selectedStation?: Station;
  provinceList: Province[];
}
export default function SaveDialog({
  onClose,
  open,
  selectedStation,
  provinceList,
}: SaveDialogProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createStationSchema),
  });
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [wardList, setWardList] = useState<Ward[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (selectedStation) {
        form.reset(selectedStation);
        await fetchDistricts(selectedStation.province);
        await fetchWards(selectedStation.district);
      } else {
        form.reset({});
      }
    };
    loadData();
  }, [selectedStation]);

  const saveStation = async (data: CreateStation) => {
    try {
      if (selectedStation) {
        await stationApiRequest.update(selectedStation.id, data);
      } else {
        await stationApiRequest.create(data);
      }
      onClose();
      form.reset({});
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const fetchDistricts = async (provinceId: string | null) => {
    let districts: District[] = [];
    try {
      if (provinceId) {
        districts = (await provinceApiRequest.getDistrict(provinceId)).payload;
      }
    } catch (error) {
      handleErrorApi({ error });
    }
    setDistrictList(districts);
    setWardList([]);
  };

  const fetchWards = async (districtId: string | null) => {
    let wards: Ward[] = [];
    try {
      if (districtId)
        wards = (await provinceApiRequest.getWards(districtId)).payload;
    } catch (error) {
      handleErrorApi({ error });
    }
    setWardList(wards);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col space-y-2">
        <DialogHeader>
          <DialogTitle>
            {selectedStation ? "Sửa" : "Tạo mới"} trạm xe
          </DialogTitle>
          <Form {...form}>
            <form
              className="space-y-4 mt-2"
              onSubmit={form.handleSubmit(
                (data) => {
                  saveStation(data);
                },
                (errors) => {
                  const error = errors.lng || errors.lat;
                  if (error) toast.error("Vui lòng chọn tọa độ trước khi lưu");
                }
              )}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-1 w-full">
                    <FormLabel>Tên trạm</FormLabel>
                    <Input
                      className="bg-white"
                      placeholder="Nhập tên trạm"
                      {...field}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel>Khu vực</FormLabel>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Controller
                      name="province"
                      control={form.control}
                      render={({ field }) => {
                        const hasError = !!form.formState.errors.province;
                        return (
                          <Combobox
                            options={provinceList.map((province) => ({
                              label: province.name,
                              value: province.idProvince,
                            }))}
                            value={field.value}
                            placeholder="Chọn tỉnh/ thành phố"
                            onChange={(value) => {
                              field.onChange(value);
                              fetchDistricts(value);
                              form.setValue("district", "");
                              form.setValue("ward", "");
                            }}
                            className={cn(
                              "w-full",
                              hasError && "border-red-500 focus:ring-red-500"
                            )}
                          />
                        );
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Controller
                      name="district"
                      control={form.control}
                      render={({ field }) => {
                        const hasError = !!form.formState.errors.district;
                        return (
                          <Combobox
                            options={districtList.map((district) => ({
                              label: district.name,
                              value: district.idDistrict,
                            }))}
                            value={field.value}
                            placeholder="Chọn quận / huyện"
                            onChange={(value) => {
                              field.onChange(value);
                              fetchWards(value);
                              form.setValue("ward", "");
                            }}
                            className={cn(
                              "w-full",
                              hasError && "border-red-500 focus:ring-red-500"
                            )}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <Controller
                    name="ward"
                    control={form.control}
                    render={({ field }) => {
                      const hasError = !!form.formState.errors.ward;
                      return (
                        <Combobox
                          options={wardList.map((ward) => ({
                            label: ward.name,
                            value: ward.idCommune,
                          }))}
                          value={field.value}
                          placeholder="Chọn xã / phường"
                          onChange={field.onChange}
                          className={cn(
                            "w-full",
                            hasError && "border-red-500 focus:ring-red-500"
                          )}
                        />
                      );
                    }}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-1 w-full">
                    <FormLabel>Địa chỉ</FormLabel>
                    <Input
                      className="bg-white"
                      placeholder="VD: Số 32, Đường Cách mạng tháng 8"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <StationPicker
                station={
                  selectedStation && {
                    lat: selectedStation.lat,
                    lng: selectedStation.lng,
                  }
                }
                onChange={(coords) => {
                  form.setValue("lat", coords.lat);
                  form.setValue("lng", coords.lng);
                }}
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
