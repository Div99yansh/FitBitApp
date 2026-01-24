import { useState, useEffect } from "react";

export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0
      );
    };

    checkTouchDevice();

    // Also listen for first touch event as a fallback
    const handleFirstTouch = () => {
      setIsTouchDevice(true);
      window.removeEventListener("touchstart", handleFirstTouch);
    };

    window.addEventListener("touchstart", handleFirstTouch, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleFirstTouch);
    };
  }, []);

  return isTouchDevice;
};
