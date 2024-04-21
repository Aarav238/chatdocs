"use client";

import { trpc } from "@/app/_trpc/client";
import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
const Providers = ({ children }: PropsWithChildren) => {
  const [queryCliet] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "'http://localhost:3000/api/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryCliet}>
      <QueryClientProvider client={queryCliet}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;
