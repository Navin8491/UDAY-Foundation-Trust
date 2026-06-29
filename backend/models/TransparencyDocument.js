import mongoose from "mongoose";

const TransparencyDocumentSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    desc: { type: String, required: true },
    file: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("TransparencyDocument", TransparencyDocumentSchema);
