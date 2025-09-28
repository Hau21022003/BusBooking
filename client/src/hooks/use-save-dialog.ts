import { useState } from "react";

export function useSaveDialog<T>() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<T | undefined>(undefined);

  const handleOpen = (item?: T) => {
    if (item) setSelected(item);
    setOpen(true);
  };

  const handleClose = () => {
    setSelected(undefined);
    setOpen(false);
  };

  return {
    open,
    selected,
    handleOpen,
    handleClose,
  };
}
