import { createClient } from "@supabase/supabase-js";

export function createServerClient(options: any = {}) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (input: RequestInfo, init?: RequestInit) =>
          fetch(input, Object.assign({}, init, { cache: "no-store" })),
      },
      ...options,
    }
  );
}
