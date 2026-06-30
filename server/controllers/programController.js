import { supabase } from "../config/db.js";
import { deleteFile } from "../services/storageService.js";
import { triggerUpdate } from "../utils/realtime.js";

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
export const getPrograms = async (req, res, next) => {
  try {
    const { data: programs, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json(programs || []);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a program
// @route   POST /api/programs
// @access  Private/Admin
export const createProgram = async (req, res, next) => {
  try {
    const { data: program, error } = await supabase
      .from("programs")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    triggerUpdate("programs");
    res.status(201).json(program);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a program
// @route   PUT /api/programs/:id
// @access  Private/Admin
export const updateProgram = async (req, res, next) => {
  try {
    const { data: program, error } = await supabase
      .from("programs")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      res.status(404);
      return next(new Error(error.message || "Program not found"));
    }
    triggerUpdate("programs");
    res.json(program);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a program
// @route   DELETE /api/programs/:id
// @access  Private/Admin
export const deleteProgram = async (req, res, next) => {
  try {
    const { data: program, error: fetchError } = await supabase
      .from("programs")
      .select("image, thumbnails")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !program) {
      res.status(404);
      return next(new Error("Program not found"));
    }

    const allUrls = [];
    if (program.image) allUrls.push(program.image);
    if (program.thumbnails && Array.isArray(program.thumbnails)) {
      program.thumbnails.forEach(url => {
        if (url) allUrls.push(url);
      });
    }

    if (allUrls.length > 0) {
      allUrls.forEach(url => {
        deleteFile(url).catch(err => console.error("Failed to delete program image from storage:", err));
      });
    }

    const { error: deleteError } = await supabase
      .from("programs")
      .delete()
      .eq("id", req.params.id);

    if (deleteError) throw deleteError;

    triggerUpdate("programs");
    res.json({ message: "Program removed successfully" });
  } catch (error) {
    next(error);
  }
};
