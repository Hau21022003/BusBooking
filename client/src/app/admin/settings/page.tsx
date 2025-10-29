import { settingsApiRequest } from "@/api-requests/settings";
import SettingsContainer from "@/app/admin/settings/settings-container";
import { SettingKey } from "@/enums/settings.enum";
import React from "react";

export default async function SettingPage() {
  const [shippingRateRes, supportEmailRes, supportPhoneRes] =
    await Promise.allSettled([
      settingsApiRequest.get(SettingKey.SHIPPING_RATE_PER_KG),
      settingsApiRequest.get(SettingKey.SUPPORT_EMAIL),
      settingsApiRequest.get(SettingKey.SUPPORT_PHONE),
    ]);
  const shippingRate =
    shippingRateRes.status === "fulfilled"
      ? shippingRateRes.value.payload.value
      : undefined;

  const supportEmail =
    supportEmailRes.status === "fulfilled"
      ? supportEmailRes.value.payload.value
      : undefined;

  const supportPhone =
    supportPhoneRes.status === "fulfilled"
      ? supportPhoneRes.value.payload.value
      : undefined;
  return (
    <SettingsContainer
      shippingRate={shippingRate}
      supportEmail={supportEmail}
      supportPhone={supportPhone}
    />
  );
}
