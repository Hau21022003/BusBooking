"use client";
import ShippingRate from "@/app/admin/settings/components/shipping-rate";
import SupportInfo from "@/app/admin/settings/components/support-info";
import { Input } from "@/components/ui/input";
import React from "react";

interface SettingsContainerProps {
  shippingRate?: number;
  supportEmail?: string;
  supportPhone?: string;
}
export default function SettingsContainer({
  shippingRate,
  supportEmail,
  supportPhone,
}: SettingsContainerProps) {
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        <p className="text-2xl font-medium">Cài đặt</p>
        <ShippingRate shippingRate={shippingRate} />
        <SupportInfo supportEmail={supportEmail} supportPhone={supportPhone} />
      </div>
    </div>
  );
}
