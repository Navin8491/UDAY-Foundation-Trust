import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      en: { type: String, required: true },
      gu: { type: String, required: true },
      hi: { type: String, required: true },
    },
    bio: {
      en: { type: String },
      gu: { type: String },
      hi: { type: String },
    },
    email: { type: String },
    img: { type: String, required: true },
    socials: {
      fb: { type: String, default: "" },
      tw: { type: String, default: "" },
      in: { type: String, default: "" },
      ln: { type: String, default: "" },
    },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("TeamMember", TeamMemberSchema);
