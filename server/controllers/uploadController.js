import { uploadFile as uploadStorageFile } from "../services/storageService.js";
import { supabase } from "../config/db.js";
import { triggerUpdate } from "../utils/realtime.js";

// @desc    Upload general file to Supabase (fallback/generic)
// @route   POST /api/upload
// @access  Private/Admin
export const uploadFile = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error("Please upload a file"));
  }

  const { folder } = req.body;

  try {
    const secureUrl = await uploadStorageFile(
      req.file,
      folder || "others"
    );

    res.status(200).json({
      url: secureUrl,
    });
  } catch (error) {
    res.status(500);
    next(new Error(`Storage upload failed: ${error.message}`));
  }
};

// @desc    Upload event image to Supabase
// @route   POST /api/events/upload
// @access  Private/Admin
export const uploadEventImage = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error("Please upload a file"));
  }

  try {
    const secureUrl = await uploadStorageFile(
      req.file,
      "events"
    );

    res.status(200).json({
      url: secureUrl,
    });
  } catch (error) {
    res.status(500);
    next(new Error(`Storage upload failed: ${error.message}`));
  }
};

// @desc    Upload gallery image to Supabase and save to Supabase
// @route   POST /api/gallery/upload
// @access  Private/Admin
export const uploadGalleryImage = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error("Please upload a file"));
  }

  try {
    const category = req.body.category || req.query.category || "Education";
    const secureUrl = await uploadStorageFile(
      req.file,
      "gallery"
    );

    // Save ONLY the secure url inside the Supabase database
    const { data: item, error } = await supabase
      .from("gallery")
      .insert([
        {
          img: secureUrl,
          cat: category,
          h: "normal",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    triggerUpdate("gallery");

    res.status(201).json({
      url: secureUrl,
      item: item,
    });
  } catch (error) {
    res.status(500);
    next(new Error(`Gallery image upload or database save failed: ${error.message}`));
  }
};

// @desc    Upload program image to Supabase
// @route   POST /api/programs/upload
// @access  Private/Admin
export const uploadProgramImage = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error("Please upload a file"));
  }

  try {
    const secureUrl = await uploadStorageFile(
      req.file,
      "programs"
    );

    res.status(200).json({
      url: secureUrl,
    });
  } catch (error) {
    res.status(500);
    next(new Error(`Storage upload failed: ${error.message}`));
  }
};

// @desc    Upload team profile image to Supabase
// @route   POST /api/team/upload
// @access  Private/Admin
export const uploadTeamImage = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error("Please upload a file"));
  }

  try {
    const secureUrl = await uploadStorageFile(
      req.file,
      "team"
    );

    res.status(200).json({
      url: secureUrl,
    });
  } catch (error) {
    res.status(500);
    next(new Error(`Storage upload failed: ${error.message}`));
  }
};
