import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAuditLogs() {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .limit(1);

  console.log("Audit logs fetch result:", { data, error });
}

testAuditLogs();
