import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const ADMIN_EMAIL = "admin@udayfoundationtrust.org";
const ADMIN_PASSWORD = "UdayAdmin2026!";

async function createAdmin() {
  console.log("Creating admin user in Supabase Auth...");

  // 1. Create the user in Supabase Auth
  const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (createError) {
    if (createError.message.includes("already been registered")) {
      console.log("Admin user already exists in Supabase Auth. Fetching existing user...");
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw new Error(listError.message);
      const existing = users.find(u => u.email === ADMIN_EMAIL);
      if (!existing) throw new Error("Could not find existing admin user.");
      return ensureAdminRecord(existing.id, ADMIN_EMAIL);
    }
    throw new Error(`Auth creation failed: ${createError.message}`);
  }

  console.log(`✅ Admin user created in Supabase Auth with ID: ${user.id}`);
  await ensureAdminRecord(user.id, ADMIN_EMAIL);
}

async function ensureAdminRecord(userId, email) {
  console.log("Ensuring admin_users table row exists...");
  const { error: insertError } = await supabase
    .from("admin_users")
    .upsert({ id: userId, email }, { onConflict: "id" });

  if (insertError) {
    console.error("❌ Failed to insert into admin_users:", insertError.message);
    console.log("\nPlease run this SQL manually in Supabase SQL Editor:");
    console.log(`
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL
);

INSERT INTO public.admin_users (id, email)
VALUES ('${userId}', '${email}')
ON CONFLICT (id) DO NOTHING;
    `);
    return;
  }

  console.log("✅ Admin record inserted into admin_users table.");
  console.log("\n===========================================");
  console.log("Admin setup complete! Login credentials:");
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log("===========================================");
}

createAdmin().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
