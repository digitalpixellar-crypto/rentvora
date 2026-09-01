import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sbxnpygebnwdwwlnuxxu.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNieG5weWdlYm53ZHd3bG51eHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxOTg3MzQsImV4cCI6MjEwMzc3NDczNH0.3R7zH_rFNFAP324Y0asxrP4D7BAkEwjO0_R6r-tpPdc';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
