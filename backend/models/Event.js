import mongoose from "mongoose";

const MultilingualTextSchema = new mongoose.Schema({
  en: { type: String, required: true },
  gu: { type: String, required: true },
  hi: { type: String, required: true },
}, { _id: false });

const MultilingualArraySchema = new mongoose.Schema({
  en: [{ type: String }],
  gu: [{ type: String }],
  hi: [{ type: String }],
}, { _id: false });

const EventSchema = new mongoose.Schema(
  {
    title: { type: MultilingualTextSchema, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    place: { type: MultilingualTextSchema, required: true },
    date: { type: String, required: true },
    summary: { type: MultilingualTextSchema, required: true },
    participants: { type: Number, default: 0 },
    volunteers: { type: Number, default: 0 },
    impact: { type: MultilingualTextSchema, required: true },
    img: { type: String, required: true },
    images: [{ type: String }],
    highlights: { type: MultilingualArraySchema },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    featured: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDesc: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);
