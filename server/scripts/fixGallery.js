/**
 * FIX GALLERY: Find and fix gallery items with blank/null/broken image URLs
 *
 * Problem: Some gallery items have null/empty img fields or /src/assets/ paths
 * that were skipped by the migration (file not found locally).
 *
 * Fix strategy:
 *  1. List all gallery items and flag those with bad URLs
 *  2. For bad items: try to find the asset locally and re-upload
 *  3. If local file not found: delete the orphan gallery record
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");
const SUPABASE_PROJECT_URL = process.env.SUPABASE_URL;
const PUBLIC_BASE = `${SUPABASE_PROJECT_URL}/storage/v1/object/public/uday-assets`;

const supabase = createClient(
  SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

/** Upload a local file to Supabase Storage and return its public URL */
async function uploadLocal(localFilePath, storagePath) {
  const fileBuffer = fs.readFileSync(localFilePath);
  const ext = path.extname(localFilePath).toLowerCase();
  const mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

  const { error } = await supabase.storage
    .from("uday-assets")
    .upload(storagePath, fileBuffer, { contentType: mimeType, upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  return `${PUBLIC_BASE}/${storagePath}`;
}

/** Try to resolve a bad img URL to a valid Supabase URL */
async function tryFixImgUrl(imgVal) {
  if (!imgVal) return null; // null/empty → cannot fix

  // Already a valid Supabase URL → it's fine
  if (typeof imgVal === "string" && imgVal.startsWith("https://")) return imgVal;

  // Old /src/assets/ path → try to upload the local file
  if (typeof imgVal === "string" && imgVal.startsWith("/src/assets/")) {
    const filename = path.basename(imgVal);
    const localFilePath = path.join(ASSETS_DIR, filename);

    if (!fs.existsSync(localFilePath)) {
      console.log(`    ⚠️  Local file not found: ${filename}`);
      return null; // Cannot fix
    }

    const storagePath = `events/${filename}`;
    
    // Check if already in storage
    const { data: existing } = await supabase.storage
      .from("uday-assets")
      .list("events", { search: filename });

    if (existing && existing.some(f => f.name === filename)) {
      return `${PUBLIC_BASE}/${storagePath}`;
    }

    return await uploadLocal(localFilePath, storagePath);
  }

  return null; // Unknown format → cannot fix
}

async function main() {
  console.log("==============================");
  console.log("  GALLERY IMAGE AUDIT & FIX");
  console.log("==============================\n");

  const { data: items, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("Failed to fetch gallery:", error.message); process.exit(1); }

  console.log(`Total gallery items: ${items.length}\n`);

  let okCount = 0;
  let fixedCount = 0;
  let deletedCount = 0;
  let stillBrokenCount = 0;

  for (const item of items) {
    const id = item.id;
    const cat = item.cat || "?";
    const img = item.img;

    // Check if this item has a good URL
    const isGood = img && typeof img === "string" && img.startsWith("https://");

    if (isGood) {
      okCount++;
      continue; // Fine — skip
    }

    console.log(`❌ Bad URL in [${cat}] (id: ${id})`);
    console.log(`   img = ${JSON.stringify(img)}`);

    // Attempt to fix
    const fixedUrl = await tryFixImgUrl(img);

    if (fixedUrl) {
      // Update the record with the fixed URL
      const { error: updateErr } = await supabase
        .from("gallery")
        .update({ img: fixedUrl })
        .eq("id", id);

      if (updateErr) {
        console.log(`   ❌ Update failed: ${updateErr.message}`);
        stillBrokenCount++;
      } else {
        console.log(`   ✅ Fixed → ${fixedUrl.split("/").slice(-2).join("/")}`);
        fixedCount++;
      }
    } else {
      // Cannot fix → delete the orphan record
      const { error: deleteErr } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id);

      if (deleteErr) {
        console.log(`   ❌ Delete failed: ${deleteErr.message}`);
        stillBrokenCount++;
      } else {
        console.log(`   🗑️  Deleted orphan record (no local file found)`);
        deletedCount++;
      }
    }
  }

  console.log("\n\n==============================");
  console.log("  GALLERY FIX SUMMARY");
  console.log("==============================");
  console.log(`✅ OK (already good):   ${okCount}`);
  console.log(`🔧 Fixed (re-uploaded):  ${fixedCount}`);
  console.log(`🗑️  Deleted (orphaned):   ${deletedCount}`);
  console.log(`⚠️  Still broken:        ${stillBrokenCount}`);
  console.log(`Total processed:         ${items.length}`);
}

main().catch(err => {
  console.error("❌ Script failed:", err.message);
  process.exit(1);
});
