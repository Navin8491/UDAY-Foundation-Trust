import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching database tables...");
  const tables = [
    "volunteers", 
    "partnerships", 
    "donations", 
    "payment_events", 
    "webhook_logs", 
    "failed_payments", 
    "audit_logs", 
    "notifications", 
    "programs", 
    "events"
  ];
  for (const table of tables) {
    const { data: cols, error: colErr } = await supabase.from(table).select("*").limit(1);
    if (colErr) {
      console.log(`Table '${table}' status: Error/Not found - ${colErr.message}`);
    } else {
      console.log(`Table '${table}' status: FOUND (${cols.length} rows loaded or empty)`);
      if (cols.length > 0) {
        console.log(`  Columns:`, Object.keys(cols[0]));
      }
    }
  }
}

run();
