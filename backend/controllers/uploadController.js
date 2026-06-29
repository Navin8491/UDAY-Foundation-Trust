import { uploadToCloudinary } from "../config/cloudinary.js";

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Public (so users can submit applications/partnerships docs too)
export const uploadFile = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error("Please upload a file"));
  }

  const { folder } = req.body; // e.g. 'events', 'gallery'
  const isPdf = req.file.mimetype === "application/pdf" || req.file.originalname.endsWith(".pdf");

  try {
    const secureUrl = await uploadToCloudinary(
      req.file.buffer,
      folder || "others",
      req.file.originalname,
      isPdf
    );

    res.status(200).json({
      url: secureUrl,
    });
  } catch (error) {
    res.status(500);
    next(new Error(`Cloudinary upload failed: ${error.message}`));
  }
};
