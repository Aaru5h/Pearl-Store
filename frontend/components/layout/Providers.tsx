"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { getQueryClient } from "@/lib/queryClient";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#FBF7F2",
            border: "1px solid #E8E0D8",
            color: "#3D3530",
            fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
            fontSize: "14px",
            borderRadius: "12px",
            boxShadow:
              "0 4px 12px rgba(92,61,46,0.1), 0 2px 4px rgba(92,61,46,0.06)",
          },
          className: "pearl-toast",
        }}
        richColors
        closeButton
      />
    </QueryClientProvider>
  );
}
