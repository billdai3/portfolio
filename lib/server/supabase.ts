/// <reference types="node" />

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseAdminClient: SupabaseClient | null = null;

type SupabaseEnv = {
  url: string;
  secretKey: string;
};

function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    return null;
  }

  return { url, secretKey };
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  supabaseAdminClient = createClient(env.url, env.secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminClient;
}
