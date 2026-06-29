import Program from "../models/Program.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";
import { triggerUpdate } from "../utils/realtime.js";

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
export const getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json(programs);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a program
// @route   POST /api/programs
// @access  Private/Admin
export const createProgram = async (req, res, next) => {
  try {
    const program = await Program.create(req.body);
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
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!program) {
      res.status(404);
      return next(new Error("Program not found"));
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
    const program = await Program.findById(req.params.id);
    if (!program) {
      res.status(404);
      return next(new Error("Program not found"));
    }

    // Clean up images in Cloudinary
    const allUrls = [];
    if (program.image) allUrls.push(program.image);
    if (program.thumbnails && Array.isArray(program.thumbnails)) {
      program.thumbnails.forEach(url => {
        if (url) allUrls.push(url);
      });
    }

    if (allUrls.length > 0) {
      allUrls.forEach(url => {
        deleteFromCloudinary(url).catch(err => console.error("Failed to delete program image from Cloudinary:", err));
      });
    }

    await program.deleteOne();
    triggerUpdate("programs");
    res.json({ message: "Program removed successfully" });
  } catch (error) {
    next(error);
  }
};
