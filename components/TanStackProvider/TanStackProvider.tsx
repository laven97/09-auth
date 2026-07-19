'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

interface TanStackProviderProps {
  children: React.ReactNode;
}

export default function TanStackProvider({
  children,
}: TanStackProviderProps) {
  const [queryClien] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClien}>{children}</QueryClientProvider>
  );
}
