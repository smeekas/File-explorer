import { useCallback, useState } from "react";

function useModal<T>() {
  const [open, setOpen] = useState<T | null>(null);
  const openModal = useCallback((newState: T) => {
    setOpen(newState);
  }, []);
  const closeModal = useCallback(() => setOpen(null), []);
  return {
    open,
    openModal,
    closeModal,
  };
}

export default useModal;
