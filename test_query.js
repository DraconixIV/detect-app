import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ogldlzjfjilpavazbini.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbGRsempmamlscGF2YXpiaW5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTc1MzYsImV4cCI6MjA5NDA5MzUzNn0.p96F0nQbzNZys4cS9TaQ2TAo3j6O7DoeoqVCLTRDkpI";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from("finds")
    .select("*, find_photos(*)");
  
  if (error) {
    console.error("QUERY ERROR:", error.message, error.details, error.hint);
  } else {
    console.log("QUERY SUCCESS! Row count:", data.length);
    console.log("First row keys:", Object.keys(data[0] || {}));
    console.log("First row find_photos relation:", data[0]?.find_photos);
  }
}
run();
