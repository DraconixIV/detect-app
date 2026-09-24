import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ogldlzjfjilpavazbini.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbGRsempmamlscGF2YXpiaW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTc1MzYsImV4cCI6MjA5NDA5MzUzNn0.p96F0nQbzNZys4cS9TaQ2TAo3j6O7DoeoqVCLTRDkpI";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  }
);

/**
 * Initializes transparent anonymous authentication in background (zero friction).
 * Non-blocking fallback if provider is disabled.
 */
export async function initAnonymousAuth() {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data?.session) {
      await supabase.auth.signInAnonymously();
    }
  } catch (e) {
    // Non-blocking graceful fallback
    console.debug("[GeoProspect Security] Auth session ready (anon fallback)");
  }
}