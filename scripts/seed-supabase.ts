import { createClient } from "@supabase/supabase-js";
import { SCHOOL_BAG_EVENTS, SCHOOL_BAG_SIMPLE_GALLERY } from "../src/constants/schoolEvents";
import { PROGRAMS_DETAIL_DATA } from "../src/constants/programs";
import { MEMBERS_DATA } from "../src/constants/team";
import { DOCS } from "../src/constants/transparency";
import { SITE } from "../src/constants/site";

import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "https://euhlbtlwbtsyrjryoesk.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  console.error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY is required in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function seed() {
  try {
    console.log("Starting Supabase Seeding...");

    // 1. Create or Check Admin User in Auth
    const adminEmail = "admin@udayfoundationtrust.org";
    const adminPassword = "UdayAdmin2026!";

    console.log(`Checking if admin user exists: ${adminEmail}...`);
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const adminUser = usersData.users.find((u) => u.email === adminEmail);
    let adminUid = "";

    if (!adminUser) {
      console.log("Admin user does not exist. Creating...");
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });
      if (createError) {
        throw new Error(`Failed to create admin user: ${createError.message}`);
      }
      adminUid = createData.user.id;
      console.log(`Admin user created with ID: ${adminUid}`);
    } else {
      adminUid = adminUser.id;
      console.log(`Admin user already exists with ID: ${adminUid}`);
    }

    // Insert into admin_users table
    console.log("Upserting into public.admin_users...");
    const { error: adminTableError } = await supabase
      .from("admin_users")
      .upsert({ id: adminUid, email: adminEmail }, { onConflict: "id" });
    if (adminTableError) {
      console.error("Warning: admin_users table upsert failed:", adminTableError.message);
    }

    // 2. Seed Settings
    console.log("Seeding Settings...");
    const { error: settingsError } = await supabase
      .from("settings")
      .upsert({
        key: "site",
        name: SITE.name,
        phone: SITE.phone,
        email: SITE.email,
        address: SITE.address,
        seoTitle: "Uday Foundation Trust | NGO for Rural Welfare",
        seoDesc: "Official portal of Uday Foundation Trust, working on education, health, and rural empowerment.",
        seoKeywords: "ngo, uday trust, rural development, tree plantation",
        socialFb: SITE.socials.facebook,
        socialTw: "",
        socialIn: SITE.socials.instagram,
        stats: {
          families: 12000,
          students: 4500,
          camps: 38,
          trees: 25000,
          volunteers: 650,
          villages: 120,
        },
        pan: "AAATU0124K",
        darpan: "GJ/2022/0315481",
        regNo: "E/22754/AHMEDABAD",
        fcr: "Not Applicable",
        twelveA: "AABTU4985NE20214",
        eightyG: "AABTU4985NF20221",
        seeded: true
      }, { onConflict: "key" });
    if (settingsError) throw settingsError;

    // 3. Seed Programs
    console.log("Seeding Programs...");
    // Delete existing to start clean
    await supabase.from("programs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const programsPayload = PROGRAMS_DETAIL_DATA.map((p, idx) => ({
      keyId: (p as any).id || (p as any).keyId,
      title: p.title,
      desc: p.desc,
      objectives: p.objectives,
      activities: p.activities,
      impactVal: p.impactVal,
      successTitle: p.successTitle || null,
      successStory: p.successStory || null,
      successQuote: p.successQuote || null,
      image: p.image,
      thumbnails: p.thumbnails || [],
      color: p.color || null,
      iconName: p.iconName || null,
      category: p.category || "General",
      displayOrder: idx,
      status: "published",
    }));
    const { error: progError } = await supabase.from("programs").insert(programsPayload);
    if (progError) throw progError;

    // 4. Seed Team
    console.log("Seeding Team...");
    await supabase.from("team").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const teamPayload = MEMBERS_DATA.map((m, idx) => ({
      memberId: (m as any).id || (m as any).memberId,
      name: m.name,
      role: m.role,
      bio: m.bio,
      email: m.email,
      phone: m.phone || null,
      img: m.img,
      socials: {
        fb: m.socials.facebook || "",
        tw: m.socials.twitter || "",
        in: m.socials.instagram || "",
        ln: m.socials.linkedin || "",
      },
      displayOrder: idx,
    }));
    const { error: teamError } = await supabase.from("team").insert(teamPayload);
    if (teamError) throw teamError;

    // 5. Seed Events
    console.log("Seeding Events...");
    await supabase.from("events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const eventsPayload = SCHOOL_BAG_EVENTS.map((e) => ({
      title: e.title,
      slug: e.id,
      category: e.category,
      place: e.place,
      date: e.date,
      summary: e.summary,
      participants: e.participants,
      volunteers: e.volunteers,
      impact: e.impact,
      img: e.img,
      images: e.images || [],
      highlights: e.highlights || null,
      status: "published",
      featured: false,
    }));
    const { error: evtError } = await supabase.from("events").insert(eventsPayload);
    if (evtError) throw evtError;

    // 6. Seed Gallery
    console.log("Seeding Gallery...");
    await supabase.from("gallery").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const galleryPayload = SCHOOL_BAG_SIMPLE_GALLERY.map((g, idx) => ({
      img: g.img,
      cat: g.cat,
      h: g.h || "normal",
      displayOrder: idx,
      uploadedAt: new Date().toISOString(),
    }));
    const { error: galError } = await supabase.from("gallery").insert(galleryPayload);
    if (galError) throw galError;

    // 7. Seed Certificates and Transparency documents
    console.log("Seeding Transparency Documents & Certificates...");
    await supabase.from("certificates").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("transparency_documents").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const certsToInsert: any[] = [];
    const docsToInsert: any[] = [];

    for (const d of DOCS) {
      const isReport = d.label.toLowerCase().includes("report") || d.desc.toLowerCase().includes("report");
      const record = {
        label: d.label,
        value: d.value,
        desc: d.desc,
        file: d.file,
        uploadedAt: new Date().toISOString(),
      };
      if (isReport) {
        docsToInsert.push(record);
      } else {
        certsToInsert.push(record);
      }
    }

    if (certsToInsert.length > 0) {
      const { error: certErr } = await supabase.from("certificates").insert(certsToInsert);
      if (certErr) throw certErr;
    }
    if (docsToInsert.length > 0) {
      const { error: docErr } = await supabase.from("transparency_documents").insert(docsToInsert);
      if (docErr) throw docErr;
    }

    console.log("Seeding completed successfully!");
  } catch (err: any) {
    console.error("Seeding failed:", err.message || err);
    process.exit(1);
  }
}

seed();
