/**
 * syncExistingEvents.js
 *
 * ONE-TIME MIGRATION: Syncs all existing event images into the gallery table.
 *
 * Run this once after deploying the auto-sync feature to backfill the gallery
 * with images that were uploaded before sync was implemented.
 *
 *   node scripts/syncExistingEvents.js
 *
 * Safe to run multiple times — duplicate gallery entries are never created
 * because we check whether each img URL already exists before inserting.
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extracts plain URL strings from either string[] or {img:string}[] */
function extractImageUrls(images) {
  if (!images || !Array.isArray(images)) return [];
  return images
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && typeof item.img === "string") return item.img;
      return null;
    })
    .filter((url) => url && url.startsWith("http"));
}

/** Alternate tall/short for masonry variety */
function heightForIndex(idx) {
  return idx % 2 === 0 ? "short" : "tall";
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=================================================");
  console.log("  SYNC EXISTING EVENT IMAGES → GALLERY");
  console.log("=================================================\n");

  // 1. Fetch all published events
  const { data: events, error: eventsErr } = await supabase
    .from("events")
    .select("id, title, category, images")
    .order("created_at", { ascending: true });

  if (eventsErr) {
    console.error("❌ Failed to fetch events:", eventsErr.message);
    process.exit(1);
  }
  console.log(`Found ${events.length} event(s) to process.\n`);

  // 2. Fetch all existing gallery img URLs (for dedup check)
  const { data: existingGallery = [], error: galleryErr } = await supabase
    .from("gallery")
    .select("img");

  if (galleryErr) {
    console.error("❌ Failed to fetch gallery:", galleryErr.message);
    process.exit(1);
  }
  const existingUrls = new Set((existingGallery || []).map((g) => g.img));
  console.log(`Gallery currently has ${existingUrls.size} item(s).\n`);

  let totalAdded    = 0;
  let totalSkipped  = 0;
  let totalEvents   = 0;

  // 3. Process each event
  for (const event of events) {
    const title    = event.title?.en || event.title || event.id;
    const urls     = extractImageUrls(event.images || []);

    if (urls.length === 0) {
      console.log(`  — "${title}": No images, skipping.`);
      continue;
    }

    totalEvents++;
    console.log(`\n  Event: "${title}" [${urls.length} image(s)]`);

    const toInsert = [];
    urls.forEach((url, idx) => {
      if (existingUrls.has(url)) {
        console.log(`    ↩️  Already in gallery: ${url.split("/").pop()}`);
        totalSkipped++;
      } else {
        toInsert.push({
          img: url,
          cat: event.category || "Events",
          h:   heightForIndex(idx),
        });
        existingUrls.add(url); // prevent double-insert within this run
      }
    });

    if (toInsert.length > 0) {
      const { error: insertErr } = await supabase
        .from("gallery")
        .insert(toInsert);

      if (insertErr) {
        console.error(`    ❌ Insert failed: ${insertErr.message}`);
      } else {
        console.log(`    ✅ Added ${toInsert.length} image(s) to gallery.`);
        totalAdded += toInsert.length;
      }
    } else {
      console.log(`    — All images already present in gallery.`);
    }
  }

  // 4. Summary
  console.log("\n\n=================================================");
  console.log("  SYNC COMPLETE");
  console.log("=================================================");
  console.log(`  Events processed:  ${totalEvents}`);
  console.log(`  Images added:      ${totalAdded}`);
  console.log(`  Images skipped:    ${totalSkipped} (already existed)`);
  console.log(`  Total gallery now: ${existingUrls.size}`);
}

main().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
