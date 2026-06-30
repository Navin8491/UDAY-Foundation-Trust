import { supabase } from "../config/db.js";
import sharp from "sharp";
import path from "path";

/**
 * Initializes the Supabase storage bucket uday-assets if it does not exist.
 */
export const initializeStorage = async () => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    
    const exists = buckets.find(b => b.name === "uday-assets");
    if (!exists) {
      const { error: createError } = await supabase.storage.createBucket("uday-assets", {
        public: true,
        allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/jpg", "application/pdf"],
        fileSizeLimit: 10 * 1024 * 1024 // 10MB
      });
      if (createError) throw createError;
      console.log("Supabase storage bucket 'uday-assets' created successfully!");
    } else {
      console.log("Supabase storage bucket 'uday-assets' is ready.");
    }
  } catch (err) {
    console.error(`Failed to initialize Supabase storage: ${err.message}`);
  }
};

/**
 * Helper to extract bucket path from a public Supabase storage URL.
 * Example URL: https://[project].supabase.co/storage/v1/object/public/uday-assets/events/file.webp
 */
const extractPathFromUrl = (url) => {
  if (!url) return null;
  const marker = "/public/uday-assets/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.substring(index + marker.length));
};

/**
 * Optimizes an image buffer using Sharp.
 * Converts to WebP format, resizes, strips metadata, and compresses to fit 100KB-200KB.
 */
const optimizeImage = async (buffer) => {
  let image = sharp(buffer);
  const metadata = await image.metadata();

  // Resize if width is larger than 1200px, keeping aspect ratio
  if (metadata.width > 1200) {
    image = image.resize(1200, null, {
      fit: "inside",
      withoutEnlargement: true
    });
  }

  // Convert to WebP format with quality 80 and high compression efficiency
  return await image
    .webp({ quality: 80, effort: 6 })
    .toBuffer();
};

/**
 * Uploads a file (either an image or document) to the Supabase Storage Bucket.
 * Automatically processes and optimizes images using Sharp before uploading.
 */
export const uploadFile = async (file, folder = "general") => {
  if (!file) throw new Error("No file provided for upload");

  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const timestamp = Date.now();
  const fileExt = path.extname(file.originalname).toLowerCase();
  const originalNameClean = path.basename(file.originalname, fileExt)
    .replace(/[^a-zA-Z0-9]/g, "_")
    .substring(0, 50);

  let uploadBuffer = file.buffer;
  let uploadName = `${timestamp}_${originalNameClean}${fileExt}`;
  let mimeType = file.mimetype;

  // If it's an image, optimize it using Sharp and convert to WebP
  if (file.mimetype.startsWith("image/")) {
    try {
      uploadBuffer = await optimizeImage(file.buffer);
      uploadName = `${timestamp}_${originalNameClean}.webp`;
      mimeType = "image/webp";
    } catch (err) {
      console.error(`Sharp optimization failed, uploading original: ${err.message}`);
    }
  }

  const filePath = `${cleanFolder}/${uploadName}`;

  // Upload buffer to Supabase Storage
  const { data, error } = await supabase.storage
    .from("uday-assets")
    .upload(filePath, uploadBuffer, {
      contentType: mimeType,
      upsert: true
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  // Retrieve public URL
  const { data: { publicUrl } } = supabase.storage
    .from("uday-assets")
    .getPublicUrl(filePath);

  return publicUrl;
};

/**
 * Deletes a file from Supabase Storage given its public URL.
 */
export const deleteFile = async (publicUrl) => {
  if (!publicUrl) return;

  const storagePath = extractPathFromUrl(publicUrl);
  if (!storagePath) {
    console.warn(`Could not extract storage path from URL: ${publicUrl}`);
    return;
  }

  const { error } = await supabase.storage
    .from("uday-assets")
    .remove([storagePath]);

  if (error) {
    console.error(`Failed to delete file from storage (${storagePath}): ${error.message}`);
  } else {
    console.log(`Deleted file from storage: ${storagePath}`);
  }
};
