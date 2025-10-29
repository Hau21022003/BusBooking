import { SettingKey } from "@/enums/settings.enum";

export type SettingValueByKey = {
  [SettingKey.SHIPPING_RATE_PER_KG]: number;
  [SettingKey.SUPPORT_EMAIL]: string;
  [SettingKey.SUPPORT_PHONE]: string;
};

export type Setting<K extends SettingKey> = {
  key: K;
  value: SettingValueByKey[K];
};
