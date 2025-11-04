import { Bus } from "@/types/bus.type";
import { useState } from "react";

export function useSaveBusDialog() {
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus>();

  const handleOpenDialog = (bus?: Bus) => {
    if (bus) setSelectedBus(bus);
    setOpenSaveDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedBus(undefined);
    setOpenSaveDialog(false);
  };

  return {
    openSaveDialog,
    selectedBus,
    handleOpenDialog,
    handleCloseDialog,
  };
}
