import TeamMember from "../models/TeamMember.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";
import { triggerUpdate } from "../utils/realtime.js";

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getTeam = async (req, res, next) => {
  try {
    const team = await TeamMember.find().sort({ displayOrder: 1 });
    res.json(team);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a team member
// @route   POST /api/team
// @access  Private/Admin
export const createTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.create(req.body);
    triggerUpdate("team");
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private/Admin
export const updateTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      res.status(404);
      return next(new Error("Team member not found"));
    }
    triggerUpdate("team");
    res.json(member);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
export const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      res.status(404);
      return next(new Error("Team member not found"));
    }

    if (member.img) {
      await deleteFromCloudinary(member.img).catch(err => console.error("Failed to delete team member image from Cloudinary:", err));
    }

    await member.deleteOne();
    triggerUpdate("team");
    res.json({ message: "Team member removed successfully" });
  } catch (error) {
    next(error);
  }
};
