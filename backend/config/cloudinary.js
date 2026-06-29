import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer memory storage
const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WEBP, GIF, and PDF files are allowed."));
    }
  }
});

// Upload buffer to Cloudinary
export const uploadToCloudinary = (fileBuffer, folder, originalName, isPdf = false) => {
  console.log("Cloudinary Config at Upload:", {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key,
    api_secret: cloudinary.config().api_secret ? "DEFINED" : "UNDEFINED"
  });
  return new Promise((resolve, reject) => {
    const publicId = `${Date.now()}_${originalName.split(".")[0].replace(/[^a-zA-Z0-9]/g, "_")}`;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `uday_foundation/${folder}`,
        resource_type: isPdf ? "raw" : "image",
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Delete file from Cloudinary by parsing its URL
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) return null;
    
    const uploadIndex = imageUrl.indexOf("/upload/");
    if (uploadIndex === -1) return null;
    
    let pathAfterUpload = imageUrl.substring(uploadIndex + 8);
    if (pathAfterUpload.match(/^v\d+\//)) {
      pathAfterUpload = pathAfterUpload.substring(pathAfterUpload.indexOf("/") + 1);
    }
    
    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    let publicId = pathAfterUpload;
    const isRaw = imageUrl.includes("/raw/upload/");
    if (!isRaw && lastDotIndex !== -1) {
      publicId = pathAfterUpload.substring(0, lastDotIndex);
    }
    
    console.log(`Deleting from Cloudinary. Public ID: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: isRaw ? "raw" : "image"
    });
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};
