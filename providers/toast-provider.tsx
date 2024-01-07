"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

const ToastProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  return (
    <>
      <Toaster position="top-center" />
    </>
  );
};

export default ToastProvider;
