import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { SCHOOL_BAG_EVENTS, SCHOOL_BAG_SIMPLE_GALLERY } from "./constants/schoolEvents";
import { PROGRAMS_DETAIL_DATA } from "./constants/programs";
import { MEMBERS_DATA } from "./constants/team";
import { DOCS } from "./constants/transparency";
import { SITE } from "./constants/site";

dotenv.config({ path: "./backend/.env" });

const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in backend/.env");
}

// Schemas inside seeder to avoid importing backend ES modules
const AdminSchema = new mongoose.Schema({ email: String, password: String });
const EventSchema = new mongoose.Schema({}, { strict: false });
const GallerySchema = new mongoose.Schema({}, { strict: false });
const ProgramSchema = new mongoose.Schema({}, { strict: false });
const TeamSchema = new mongoose.Schema({}, { strict: false });
const DocSchema = new mongoose.Schema({}, { strict: false });
const SettingSchema = new mongoose.Schema({}, { strict: false });

const AdminUser = mongoose.model("AdminUser", AdminSchema);
const Event = mongoose.model("Event", EventSchema);
const Gallery = mongoose.model("Gallery", GallerySchema);
const Program = mongoose.model("Program", ProgramSchema);
const TeamMember = mongoose.model("TeamMember", TeamSchema);
const Certificate = mongoose.model("Certificate", DocSchema);
const TransparencyDocument = mongoose.model("TransparencyDocument", DocSchema);
const Setting = mongoose.model("Setting", SettingSchema);

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    // 1. Seed Admin
    console.log("Seeding administrator...");
    await AdminUser.deleteMany({});
    const adminEmail = process.env.ADMIN_EMAIL || "admin@udayfoundationtrust.org";
    const adminPassword = process.env.ADMIN_PASSWORD || "UdayAdmin2026!";
    const hash = await bcrypt.hash(adminPassword, 10);
    await AdminUser.create({
      email: adminEmail,
      password: hash
    });
    console.log(`Admin seeded: ${adminEmail}`);

    // 2. Seed Settings
    console.log("Seeding site settings...");
    await Setting.deleteMany({});
    await Setting.create({
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
    });

    // 3. Seed Programs
    console.log("Seeding programs...");
    await Program.deleteMany({});
    await Program.insertMany(PROGRAMS_DETAIL_DATA);

    // 4. Seed Team
    console.log("Seeding team...");
    await TeamMember.deleteMany({});
    let order = 0;
    const teamData = MEMBERS_DATA.map(m => ({
      ...m,
      displayOrder: order++
    }));
    await TeamMember.insertMany(teamData);

    // 5. Seed Events
    console.log("Seeding events...");
    await Event.deleteMany({});
    const eventsData = SCHOOL_BAG_EVENTS.map(e => ({
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
      images: e.images,
      highlights: e.highlights || null,
      status: "published",
      featured: false
    }));
    await Event.insertMany(eventsData);

    // 6. Seed Gallery
    console.log("Seeding gallery...");
    await Gallery.deleteMany({});
    const galleryData = SCHOOL_BAG_SIMPLE_GALLERY.map(g => ({
      img: g.img,
      cat: g.cat,
      h: g.h || "normal",
      uploadedAt: new Date()
    }));
    await Gallery.insertMany(galleryData);

    // 7. Seed Certificates & Documents
    console.log("Seeding transparency docs...");
    await Certificate.deleteMany({});
    await TransparencyDocument.deleteMany({});
    for (const d of DOCS) {
      const isReport = d.label.toLowerCase().includes("report") || d.desc.toLowerCase().includes("report");
      const Model = isReport ? TransparencyDocument : Certificate;
      await Model.create({
        label: d.label,
        value: d.value,
        desc: d.desc,
        file: d.file,
        uploadedAt: new Date()
      });
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
