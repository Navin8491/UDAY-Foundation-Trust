import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectDonations() {
  console.log("Fetching latest 3 donation records...");
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching donations:", error.message);
  } else {
    console.log(`Found ${data.length} donations.`);
    data.forEach((don, idx) => {
      console.log(`\nDonation #${idx + 1}:`);
      Object.keys(don).forEach(key => {
        console.log(`  ${key}:`, don[key]);
      });
    });
  }
}

inspectDonations();
