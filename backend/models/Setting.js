import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "site" },
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    seoTitle: { type: String },
    seoDesc: { type: String },
    seoKeywords: { type: String },
    socialFb: { type: String },
    socialTw: { type: String },
    socialIn: { type: String },
    stats: {
      families: { type: Number, default: 12000 },
      students: { type: Number, default: 4500 },
      camps: { type: Number, default: 38 },
      trees: { type: Number, default: 25000 },
      volunteers: { type: Number, default: 650 },
      villages: { type: Number, default: 120 },
    },
    pan: { type: String },
    darpan: { type: String },
    regNo: { type: String },
    fcr: { type: String },
    twelveA: { type: String },
    eightyG: { type: String },
    seeded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", SettingSchema);
