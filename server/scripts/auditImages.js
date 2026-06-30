import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function auditImages() {
  console.log("\n==============================");
  console.log("   IMAGE URL AUDIT REPORT");
  console.log("==============================\n");

  // Helper to classify a URL
  const classifyUrl = (url) => {
    if (!url) return "❌ NULL/EMPTY";
    if (url.startsWith("https://euhlbtlwbtsyrjryoesk.supabase.co")) return "✅ Supabase URL";
    if (url.startsWith("http://") || url.startsWith("https://")) return "⚠️  External URL: " + new URL(url).hostname;
    if (url.startsWith("/assets/")) return "❌ Relative Vite asset (broken in prod)";
    if (url.startsWith("/")) return "❌ Relative path (broken in prod)";
    if (url.startsWith("data:")) return "⚠️  Base64 data URL";
    return "❌ BARE FILENAME (broken): " + url;
  };

  // ---- EVENTS ----
  console.log("📁 EVENTS TABLE:");
  const { data: events, error: evError } = await supabase.from("events").select("id, title, img, images").limit(50);
  if (evError) { console.error("  Error:", evError.message); }
  else {
    events.forEach(ev => {
      const title = ev.title?.en || ev.title || "(no title)";
      console.log(`\n  Event: "${title.substring(0,60)}"`);
      console.log(`    img: ${classifyUrl(ev.img)}`);
      if (ev.images) {
        const imgs = Array.isArray(ev.images) ? ev.images : [];
        imgs.slice(0, 3).forEach((img, i) => {
          const url = typeof img === "string" ? img : img?.img;
          console.log(`    images[${i}]: ${classifyUrl(url)}`);
        });
        if (imgs.length > 3) console.log(`    ...and ${imgs.length - 3} more images`);
      }
    });
  }

  // ---- GALLERY ----
  console.log("\n\n📁 GALLERY TABLE (first 10):");
  const { data: gallery, error: galError } = await supabase.from("gallery").select("id, img, cat").limit(10);
  if (galError) { console.error("  Error:", galError.message); }
  else {
    gallery.forEach(item => {
      console.log(`  [${item.cat}] img: ${classifyUrl(item.img)}`);
    });
  }

  // ---- PROGRAMS ----
  console.log("\n\n📁 PROGRAMS TABLE:");
  const { data: programs, error: progError } = await supabase.from("programs").select("id, title, image, thumbnails").limit(20);
  if (progError) { console.error("  Error:", progError.message); }
  else {
    programs.forEach(prog => {
      const title = prog.title?.en || prog.title || "(no title)";
      console.log(`\n  Program: "${title.substring(0,60)}"`);
      console.log(`    image: ${classifyUrl(prog.image)}`);
      if (prog.thumbnails) {
        const thumbs = Array.isArray(prog.thumbnails) ? prog.thumbnails : [];
        thumbs.slice(0,2).forEach((t, i) => console.log(`    thumbnails[${i}]: ${classifyUrl(t)}`));
      }
    });
  }

  // ---- TEAM ----
  console.log("\n\n📁 TEAM TABLE:");
  const { data: team, error: teamError } = await supabase.from("team").select("id, name, img").limit(20);
  if (teamError) { console.error("  Error:", teamError.message); }
  else {
    team.forEach(member => {
      const name = member.name?.en || member.name || "(no name)";
      console.log(`  ${name}: ${classifyUrl(member.img)}`);
    });
  }

  console.log("\n\n==============================");
  console.log("   AUDIT COMPLETE");
  console.log("==============================\n");
}

auditImages().catch(err => {
  console.error("Audit failed:", err.message);
  process.exit(1);
});
