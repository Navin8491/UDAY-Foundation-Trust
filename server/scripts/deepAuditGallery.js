/**
 * DEEP GALLERY AUDIT: Verify each gallery item's image URL actually loads (HTTP check)
 * Fix or delete any that return 404 / non-image content.
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import https from "https";
import http from "http";
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

/** HEAD request to check if URL is accessible and returns an image */
function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith("http")) {
      resolve({ ok: false, status: 0, type: null });
      return;
    }
    const lib = url.startsWith("https") ? https : http;
    const req = lib.request(url, { method: "HEAD", timeout: 8000 }, (res) => {
      resolve({
        ok: res.statusCode >= 200 && res.statusCode < 400,
        status: res.statusCode,
        type: res.headers["content-type"] || "",
      });
    });
    req.on("timeout", () => { req.destroy(); resolve({ ok: false, status: 0, type: null }); });
    req.on("error", () => resolve({ ok: false, status: 0, type: null }));
    req.end();
  });
}

/** Upload a local file to Supabase Storage */
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

async function main() {
  console.log("============================================");
  console.log("  GALLERY DEEP URL AUDIT & FIX");
  console.log("============================================\n");

  const { data: items, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error("Failed to fetch gallery:", error.message); process.exit(1); }

  console.log(`Checking ${items.length} gallery items...\n`);

  let okCount = 0;
  let fixedCount = 0;
  let deletedCount = 0;
  let badList = [];

  // Check in batches to avoid hammering the server
  const BATCH = 10;
  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(item => checkUrl(item.img)));

    for (let j = 0; j < batch.length; j++) {
      const item = batch[j];
      const { ok, status, type } = results[j];

      if (ok && type && type.startsWith("image/")) {
        okCount++;
      } else {
        badList.push({ item, status, type });
        console.log(`❌ [${item.cat}] status=${status} type=${type || "n/a"}`);
        console.log(`   URL: ${item.img}`);
      }
    }
    process.stdout.write(`  Checked ${Math.min(i + BATCH, items.length)}/${items.length}...\r`);
  }

  console.log(`\n\n--- Found ${badList.length} items with bad URLs ---\n`);

  // Try to fix each bad item
  for (const { item } of badList) {
    const filename = path.basename(item.img || "").split("?")[0];
    if (!filename) {
      // No filename extractable → delete
      await supabase.from("gallery").delete().eq("id", item.id);
      console.log(`🗑️  Deleted [${item.cat}] — no filename`);
      deletedCount++;
      continue;
    }

    // Try to find the local file
    const localFilePath = path.join(ASSETS_DIR, filename);
    if (fs.existsSync(localFilePath)) {
      try {
        const storagePath = `events/${filename}`;
        const newUrl = await uploadLocal(localFilePath, storagePath);
        await supabase.from("gallery").update({ img: newUrl }).eq("id", item.id);
        console.log(`✅ Fixed [${item.cat}] → uploaded ${filename}`);
        fixedCount++;
      } catch (err) {
        console.log(`⚠️  Could not upload ${filename}: ${err.message}`);
        await supabase.from("gallery").delete().eq("id", item.id);
        console.log(`🗑️  Deleted [${item.cat}] — upload failed`);
        deletedCount++;
      }
    } else {
      // Local file not found → delete orphan
      await supabase.from("gallery").delete().eq("id", item.id);
      console.log(`🗑️  Deleted [${item.cat}] — local file not found (${filename})`);
      deletedCount++;
    }
  }

  console.log("\n\n============================================");
  console.log("  SUMMARY");
  console.log("============================================");
  console.log(`✅ Good URLs:            ${okCount}`);
  console.log(`🔧 Fixed (re-uploaded):  ${fixedCount}`);
  console.log(`🗑️  Deleted (orphaned):   ${deletedCount}`);
  console.log(`📦 Total items:          ${items.length}`);
}

main().catch(err => {
  console.error("❌ Script failed:", err.message);
  process.exit(1);
});
