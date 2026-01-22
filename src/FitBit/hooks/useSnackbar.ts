import { useState, useCallback } from "react";
import type { SnackbarState } from "../types";

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showSnackbar = useCallback(
    (message: string, type: "success" | "error") => {
      setSnackbar({ message, type, isVisible: true });
    },
    []
  );

  const hideSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return { snackbar, showSnackbar, hideSnackbar };
};
