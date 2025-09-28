import http from "@/lib/http";
import { District, Province, Ward } from "@/types/province.type";

const BASE_URL = "/province";
export const provinceApiRequest = {
  getProvinces: () =>
    http.get<Province[]>(`${BASE_URL}`, { cache: "force-cache" }),
  getDistrict: (provinceId: string) =>
    http.get<District[]>(`${BASE_URL}/${provinceId}/districts`),
  getWards: (districtId: string) =>
    http.get<Ward[]>(`${BASE_URL}/district/${districtId}/wards`),
};
