import Gallery from "../models/Gallery.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";
import { triggerUpdate } from "../utils/realtime.js";

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req, res, next) => {
  try {
    const items = await Gallery.find().sort({ displayOrder: 1, uploadedAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a gallery item
// @route   POST /api/gallery
// @access  Private/Admin
export const createGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.create(req.body);
    triggerUpdate("gallery");
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      res.status(404);
      return next(new Error("Gallery item not found"));
    }

    if (item.img) {
      await deleteFromCloudinary(item.img).catch(err => console.error("Failed to delete gallery image from Cloudinary:", err));
    }

    await item.deleteOne();
    triggerUpdate("gallery");
    res.json({ message: "Gallery item removed successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
export const updateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404);
      return next(new Error("Gallery item not found"));
    }
    triggerUpdate("gallery");
    res.json(item);
  } catch (error) {
    next(error);
  }
};
