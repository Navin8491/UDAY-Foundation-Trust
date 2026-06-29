import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    img: { type: String, required: true },
    cat: { type: String, required: true },
    h: { type: String, enum: ["normal", "tall"], default: "normal" },
    displayOrder: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", GallerySchema);
