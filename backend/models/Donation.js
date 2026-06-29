import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true },
    amount: { type: Number, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    pan: { type: String },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Donation", DonationSchema);
