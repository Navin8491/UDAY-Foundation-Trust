import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("CRITICAL: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required in backend/.env.");
  process.exit(1);
}

// Initialize Supabase Client with the Service Role Key to bypass RLS policies on the backend
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const connectDB = async () => {
  try {
    const { data, error } = await supabase.from("settings").select("key").limit(1);
    if (error) {
      throw error;
    }
    console.log("Supabase Client Connection Established!");
  } catch (error) {
    console.error(`Supabase database connection failed: ${error.message}`);
    process.exit(1);
  }
};
