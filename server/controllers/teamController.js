import { supabase } from "../config/db.js";
import { deleteFile } from "../services/storageService.js";
import { triggerUpdate } from "../utils/realtime.js";

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getTeam = async (req, res, next) => {
  try {
    const { data: team, error } = await supabase
      .from("team")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json(team || []);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a team member
// @route   POST /api/team
// @access  Private/Admin
export const createTeamMember = async (req, res, next) => {
  try {
    const { data: member, error } = await supabase
      .from("team")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
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
    const { data: member, error } = await supabase
      .from("team")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      res.status(404);
      return next(new Error(error.message || "Team member not found"));
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
    const { data: member, error: fetchError } = await supabase
      .from("team")
      .select("img")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !member) {
      res.status(404);
      return next(new Error("Team member not found"));
    }

    if (member.img) {
      await deleteFile(member.img).catch(err => console.error("Failed to delete team member image from storage:", err));
    }

    const { error: deleteError } = await supabase
      .from("team")
      .delete()
      .eq("id", req.params.id);

    if (deleteError) throw deleteError;

    triggerUpdate("team");
    res.json({ message: "Team member removed successfully" });
  } catch (error) {
    next(error);
  }
};
