/**
 * gallerySync.js
 *
 * Server-side utility that keeps the `gallery` table automatically in sync
 * with the `events` table whenever event images are added, changed, or removed.
 *
 * Deduplication key: `img` URL (each uploaded file has a unique timestamped
 * filename so the URL is globally unique across all records).
 */

import { supabase } from "../config/db.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts plain URL strings from either:
 *   - string[]           e.g. ["https://…/img.jpg"]
 *   - {img:string}[]     e.g. [{img:"https://…", caption:{…}, category:"…"}]
 *
 * Filters out any empty / non-string values.
 */
export function extractImageUrls(images) {
  if (!images || !Array.isArray(images)) return [];
  return images
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && typeof item.img === "string") return item.img;
      return null;
    })
    .filter((url) => url && url.startsWith("http"));
}

/**
 * Determines the gallery `h` value ("tall" | "short") for a given index.
 * Alternates tall/short to produce a visually varied masonry grid.
 */
function heightForIndex(idx) {
  return idx % 2 === 0 ? "short" : "tall";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main sync function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Syncs event images into (and out of) the gallery table.
 *
 * @param {string} eventCategory  e.g. "Education", "Sports"
 * @param {Array}  newImages      Current event.images array (after save)
 * @param {Array}  oldImages      Previous event.images array (before save); [] on create
 *
 * Behaviour:
 *   • ADDED images   → checked for duplicates, then INSERTed into gallery
 *   • REMOVED images → DELETEd from gallery (by img URL)
 *   • UNCHANGED URLs → left alone — no writes
 *
 * Errors are logged but never thrown; gallery sync failures are non-fatal.
 */
export async function syncEventGallery(eventCategory, newImages, oldImages = []) {
  try {
    const newUrls = extractImageUrls(newImages);
    const oldUrls = extractImageUrls(oldImages);

    const addedUrls   = newUrls.filter((u) => !oldUrls.includes(u));
    const removedUrls = oldUrls.filter((u) => !newUrls.includes(u));

    // ── INSERT new gallery items ────────────────────────────────────────────
    if (addedUrls.length > 0) {
      // Fetch any that already exist to prevent duplicates
      const { data: existing = [] } = await supabase
        .from("gallery")
        .select("img")
        .in("img", addedUrls);

      const alreadyPresent = new Set((existing || []).map((r) => r.img));

      const toInsert = addedUrls
        .filter((url) => !alreadyPresent.has(url))
        .map((url, idx) => ({
          img: url,
          cat: eventCategory || "Events",
          h:   heightForIndex(idx),
        }));

      if (toInsert.length > 0) {
        const { error } = await supabase.from("gallery").insert(toInsert);
        if (error) {
          console.error("[GallerySync] INSERT failed:", error.message);
        } else {
          console.log(`[GallerySync] Added ${toInsert.length} image(s) to gallery.`);
        }
      }
    }

    // ── DELETE removed gallery items ────────────────────────────────────────
    if (removedUrls.length > 0) {
      const { error } = await supabase
        .from("gallery")
        .delete()
        .in("img", removedUrls);

      if (error) {
        console.error("[GallerySync] DELETE failed:", error.message);
      } else {
        console.log(`[GallerySync] Removed ${removedUrls.length} image(s) from gallery.`);
      }
    }

    if (addedUrls.length === 0 && removedUrls.length === 0) {
      console.log("[GallerySync] No image changes detected — gallery unchanged.");
    }
  } catch (err) {
    // Non-fatal: log but never break the event save
    console.error("[GallerySync] Unexpected error:", err.message);
  }
}
