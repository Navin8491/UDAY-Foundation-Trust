import { supabase } from "../config/db.js";
import { deleteFile } from "../services/storageService.js";
import { triggerUpdate } from "../utils/realtime.js";

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req, res, next) => {
  try {
    const { data: items, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(items || []);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a gallery item
// @route   POST /api/gallery
// @access  Private/Admin
export const createGalleryItem = async (req, res, next) => {
  try {
    const { data: item, error } = await supabase
      .from("gallery")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    triggerUpdate("gallery");
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
export const updateGalleryItem = async (req, res, next) => {
  try {
    const { data: item, error } = await supabase
      .from("gallery")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      res.status(404);
      return next(new Error(error.message || "Gallery item not found"));
    }
    triggerUpdate("gallery");
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const { data: item, error: fetchError } = await supabase
      .from("gallery")
      .select("img")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !item) {
      res.status(404);
      return next(new Error("Gallery item not found"));
    }

    if (item.img) {
      await deleteFile(item.img).catch(err => console.error("Failed to delete gallery image from storage:", err));
    }

    const { error: deleteError } = await supabase
      .from("gallery")
      .delete()
      .eq("id", req.params.id);

    if (deleteError) throw deleteError;

    triggerUpdate("gallery");
    res.json({ message: "Gallery item removed successfully" });
  } catch (error) {
    next(error);
  }
};
