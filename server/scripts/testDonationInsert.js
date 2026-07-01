import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testInsert() {
  const payload = {
    donorName: "Test Name",
    email: "test@example.com",
    phone: "1234567890",
    address: "123 Test Street",
    panNumber: "ABCDE1234F",
    amount: 1000,
    purpose: "General Donation"
  };

  const { data, error } = await supabase
    .from("donations")
    .insert([payload])
    .select();

  console.log("Insert result with camelCase:");
  console.log("Data:", data);
  console.log("Error:", error);
}

testInsert();
