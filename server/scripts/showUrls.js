import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function showActualUrls() {
  console.log("\n=== ACTUAL URL VALUES IN DATABASE ===\n");

  const { data: events } = await supabase.from("events").select("title, img, images").limit(3);
  events?.forEach(ev => {
    console.log("Event:", ev.title?.en);
    console.log("  img:", ev.img);
    const imgs = ev.images || [];
    imgs.slice(0,2).forEach((img, i) => {
      const url = typeof img === "string" ? img : img?.img;
      console.log(`  images[${i}]:`, url);
    });
    console.log();
  });

  const { data: gallery } = await supabase.from("gallery").select("img, cat").limit(3);
  console.log("=== GALLERY SAMPLES ===");
  gallery?.forEach(g => console.log(`[${g.cat}]:`, g.img));

  const { data: team } = await supabase.from("team").select("name, img").limit(3);
  console.log("\n=== TEAM SAMPLES ===");
  team?.forEach(t => console.log(`${t.name?.en}:`, t.img));

  const { data: programs } = await supabase.from("programs").select("title, image, thumbnails").limit(2);
  console.log("\n=== PROGRAMS SAMPLES ===");
  programs?.forEach(p => {
    console.log(`${p.title?.en}:`, p.image);
    (p.thumbnails || []).slice(0,2).forEach((t, i) => console.log(`  thumb[${i}]:`, t));
  });
}

showActualUrls().catch(console.error);
