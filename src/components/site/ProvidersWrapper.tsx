"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "sonner";

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Toaster position="top-right" closeButton richColors />
      {children}
    </LanguageProvider>
  );
}
