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

const ProgramSchema = new mongoose.Schema(
  {
    iconName: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: String, required: true },
    thumbnails: [{ type: String }],
    title: { type: MultilingualTextSchema, required: true },
    desc: { type: MultilingualTextSchema, required: true },
    objectives: { type: MultilingualArraySchema },
    activities: { type: MultilingualArraySchema },
    impactVal: { type: MultilingualTextSchema, required: true },
    successTitle: { type: MultilingualTextSchema },
    successStory: { type: MultilingualTextSchema },
    successQuote: { type: MultilingualTextSchema },
    category: { type: String, default: "General" },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "published" },
  },
  { timestamps: true }
);

export default mongoose.model("Program", ProgramSchema);
