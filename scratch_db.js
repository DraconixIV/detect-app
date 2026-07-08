import { supabase } from "./src/supabase.js";

async function run() {
  const { data, error } = await supabase.from("finds").select("*").limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Keys in finds:", Object.keys(data[0] || {}));
    console.log("Record sample:", data[0]);
  }
}
run();
