import { SettingKey } from "@/enums/settings.enum";
import http from "@/lib/http";
import { SettingInput } from "@/schemas/settings.schema";
import { Setting } from "@/types/settings.type";

const BASE_URL = "/settings";

export const settingsApiRequest = {
  set: (body: SettingInput) => http.post(BASE_URL, body),
  get: async <K extends SettingKey>(key: K) =>
    http.get<Setting<K>>(`${BASE_URL}/${key}`),
};
