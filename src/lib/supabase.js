import { createClient } from '@supabase/supabase-js';

const FALLBACK_LOCAL_URL = 'http://127.0.0.1:54331';
const FALLBACK_LOCAL_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

function resolveSupabaseUrl() {
  const configuredUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_LOCAL_URL;
  const isLocalSupabase =
    configuredUrl.includes('127.0.0.1') || configuredUrl.includes('localhost');

  if (
    isLocalSupabase &&
    typeof window !== 'undefined' &&
    window.location?.origin &&
    !['localhost', '127.0.0.1'].includes(window.location.hostname)
  ) {
    return `${window.location.origin}/supabase-local`;
  }

  return configuredUrl;
}

const supabaseUrl = resolveSupabaseUrl();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_LOCAL_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
