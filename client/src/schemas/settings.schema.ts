import { SettingKey } from "@/enums/settings.enum";
import z from "zod";

export const ShippingRateSettingSchema = z.object({
  key: z
    .literal(SettingKey.SHIPPING_RATE_PER_KG)
    .default(SettingKey.SHIPPING_RATE_PER_KG),
  value: z.number("Chi phí vận chuyển / kg bị trống"),
});

export const SupportEmailSettingSchema = z.object({
  key: z.literal(SettingKey.SUPPORT_EMAIL).default(SettingKey.SUPPORT_EMAIL),
  value: z.string("Email hỗ trợ bị trống").min(1, "Email hỗ trợ bị trống"),
});

export const SupportPhoneSettingSchema = z.object({
  key: z.literal(SettingKey.SUPPORT_PHONE).default(SettingKey.SUPPORT_PHONE),
  value: z.string("SDT hỗ trợ bị trống").min(1, "SDT hỗ trợ bị trống"),
});

export const SettingSchema = z.union([
  ShippingRateSettingSchema,
  SupportEmailSettingSchema,
  SupportPhoneSettingSchema,
]);

export type ShippingRateSetting = z.infer<typeof ShippingRateSettingSchema>;
export type SupportEmailSetting = z.infer<typeof SupportEmailSettingSchema>;
export type SupportPhoneSetting = z.infer<typeof SupportPhoneSettingSchema>;

export type SettingInput = z.infer<typeof SettingSchema>;
