/**
 * MIGRATION: Fix broken /src/assets/* image URLs in the database
 *
 * Root Cause: Database stores Vite dev-server paths (/src/assets/XXX.jpg)
 * which don't exist on Vercel production (files are hashed by Vite build).
 *
 * Fix: Upload every referenced local asset to Supabase Storage and
 * update every database record with the correct public Supabase URL.
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

// ── Upload cache so we don't re-upload the same file ──────────────────────
const uploadCache = new Map(); // localPath -> supabasePublicUrl

/**
 * Converts a /src/assets/XXX.jpg path into a full Supabase public URL.
 * Uploads the file to Supabase Storage if not already cached.
 */
async function resolveUrl(srcPath, folder = "general") {
  if (!srcPath) return srcPath;

  // Already a proper Supabase URL — leave it alone
  if (srcPath.startsWith("https://")) return srcPath;

  // Must start with /src/assets/
  if (!srcPath.startsWith("/src/assets/")) {
    console.warn(`  ⚠️  Unexpected path format, skipping: ${srcPath}`);
    return srcPath;
  }

  const filename = path.basename(srcPath);
  const localFilePath = path.join(ASSETS_DIR, filename);

  if (!fs.existsSync(localFilePath)) {
    console.warn(`  ⚠️  Local file not found, skipping: ${localFilePath}`);
    return srcPath;
  }

  // Check cache
  if (uploadCache.has(localFilePath)) {
    return uploadCache.get(localFilePath);
  }

  // Determine storage folder from filename patterns
  const autoFolder = guessFolder(filename, folder);
  const storagePath = `${autoFolder}/${filename}`;
  const publicUrl = `${PUBLIC_BASE}/${storagePath}`;

  // Check if already exists in Supabase (to avoid re-upload)
  const { data: existing } = await supabase.storage
    .from("uday-assets")
    .list(autoFolder, { search: filename });

  if (existing && existing.some(f => f.name === filename)) {
    console.log(`  ↩️  Already in storage: ${storagePath}`);
    uploadCache.set(localFilePath, publicUrl);
    return publicUrl;
  }

  // Upload
  const fileBuffer = fs.readFileSync(localFilePath);
  const ext = path.extname(filename).toLowerCase();
  const mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

  const { error } = await supabase.storage
    .from("uday-assets")
    .upload(storagePath, fileBuffer, { contentType: mimeType, upsert: true });

  if (error) {
    console.error(`  ❌ Upload failed for ${filename}: ${error.message}`);
    return srcPath; // Keep original path if upload fails
  }

  console.log(`  ✅ Uploaded: ${storagePath}`);
  uploadCache.set(localFilePath, publicUrl);
  return publicUrl;
}

/** Guess the Supabase storage folder based on filename patterns */
function guessFolder(filename, defaultFolder) {
  const name = filename.toLowerCase();
  if (name.includes("president") || name.includes("vice-president") || name.includes("treasurer") ||
      name.includes("prakash") || name.includes("kartikeya") || name.includes("kuldeep") ||
      name.includes("mehul") || name.includes("rahul")) return "team";
  if (name.includes("gallery")) return "gallery";
  // Events and general assets
  return defaultFolder || "events";
}

/** Resolve an image field that can be string or object with .img */
async function resolveImgField(val, folder) {
  if (!val) return val;
  if (typeof val === "string") return resolveUrl(val, folder);
  if (typeof val === "object" && val.img) {
    return { ...val, img: await resolveUrl(val.img, folder) };
  }
  return val;
}

// ── EVENTS ────────────────────────────────────────────────────────────────
async function migrateEvents() {
  console.log("\n\n══ MIGRATING EVENTS ══");
  const { data: events, error } = await supabase.from("events").select("*");
  if (error) { console.error("Failed to fetch events:", error.message); return; }

  for (const ev of events) {
    const title = ev.title?.en || ev.id;
    console.log(`\n  Event: "${title}"`);

    let changed = false;
    const updates = {};

    // Migrate cover image
    const newImg = await resolveUrl(ev.img, "events");
    if (newImg !== ev.img) { updates.img = newImg; changed = true; }

    // Migrate images array
    if (ev.images && Array.isArray(ev.images)) {
      const newImages = await Promise.all(
        ev.images.map(img => resolveImgField(img, "events"))
      );
      // Deep compare
      if (JSON.stringify(newImages) !== JSON.stringify(ev.images)) {
        updates.images = newImages;
        changed = true;
      }
    }

    if (changed) {
      const { error: updateError } = await supabase
        .from("events")
        .update(updates)
        .eq("id", ev.id);

      if (updateError) console.error(`  ❌ Update failed: ${updateError.message}`);
      else console.log(`  ✅ Event updated in DB`);
    } else {
      console.log(`  — No changes needed`);
    }
  }
}

// ── GALLERY ───────────────────────────────────────────────────────────────
async function migrateGallery() {
  console.log("\n\n══ MIGRATING GALLERY ══");
  const { data: gallery, error } = await supabase.from("gallery").select("*");
  if (error) { console.error("Failed to fetch gallery:", error.message); return; }

  for (const item of gallery) {
    const newImg = await resolveUrl(item.img, "gallery");
    if (newImg !== item.img) {
      const { error: updateError } = await supabase
        .from("gallery")
        .update({ img: newImg })
        .eq("id", item.id);

      if (updateError) console.error(`  ❌ Gallery update failed: ${updateError.message}`);
      else console.log(`  ✅ Gallery [${item.cat}] updated`);
    }
  }
}

// ── PROGRAMS ──────────────────────────────────────────────────────────────
async function migratePrograms() {
  console.log("\n\n══ MIGRATING PROGRAMS ══");
  const { data: programs, error } = await supabase.from("programs").select("*");
  if (error) { console.error("Failed to fetch programs:", error.message); return; }

  for (const prog of programs) {
    const title = prog.title?.en || prog.id;
    console.log(`\n  Program: "${title}"`);

    let changed = false;
    const updates = {};

    const newImage = await resolveUrl(prog.image, "programs");
    if (newImage !== prog.image) { updates.image = newImage; changed = true; }

    if (prog.thumbnails && Array.isArray(prog.thumbnails)) {
      const newThumbs = await Promise.all(
        prog.thumbnails.map(t => resolveUrl(t, "programs"))
      );
      if (JSON.stringify(newThumbs) !== JSON.stringify(prog.thumbnails)) {
        updates.thumbnails = newThumbs;
        changed = true;
      }
    }

    if (changed) {
      const { error: updateError } = await supabase
        .from("programs")
        .update(updates)
        .eq("id", prog.id);

      if (updateError) console.error(`  ❌ Update failed: ${updateError.message}`);
      else console.log(`  ✅ Program updated in DB`);
    } else {
      console.log(`  — No changes needed`);
    }
  }
}

// ── TEAM ──────────────────────────────────────────────────────────────────
async function migrateTeam() {
  console.log("\n\n══ MIGRATING TEAM ══");
  const { data: team, error } = await supabase.from("team").select("*");
  if (error) { console.error("Failed to fetch team:", error.message); return; }

  for (const member of team) {
    const name = member.name?.en || member.id;
    const newImg = await resolveUrl(member.img, "team");
    if (newImg !== member.img) {
      const { error: updateError } = await supabase
        .from("team")
        .update({ img: newImg })
        .eq("id", member.id);

      if (updateError) console.error(`  ❌ Team update failed for ${name}: ${updateError.message}`);
      else console.log(`  ✅ Team member "${name}" updated`);
    } else {
      console.log(`  — "${name}": No changes needed`);
    }
  }
}

// ── MAIN ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("==============================");
  console.log("  SUPABASE IMAGE MIGRATION");
  console.log("==============================");
  console.log(`Assets directory: ${ASSETS_DIR}`);
  console.log(`Supabase project: ${SUPABASE_PROJECT_URL}`);

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error("❌ Assets directory not found:", ASSETS_DIR);
    process.exit(1);
  }

  await migrateEvents();
  await migrateGallery();
  await migratePrograms();
  await migrateTeam();

  console.log("\n\n==============================");
  console.log("  MIGRATION COMPLETE ✅");
  console.log("==============================");
  console.log(`Total files uploaded: ${uploadCache.size}`);
}

main().catch(err => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
