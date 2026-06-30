import { supabase } from "../config/db.js";
import { triggerUpdate } from "../utils/realtime.js";

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let { data: settings, error } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "site")
      .maybeSingle();

    if (error) throw error;

    if (!settings) {
      // Create default site settings if they don't exist
      const { data: created, error: createError } = await supabase
        .from("settings")
        .insert([{ key: "site" }])
        .select()
        .single();
      
      if (createError) throw createError;
      settings = created;
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res, next) => {
  try {
    const { data: settings, error } = await supabase
      .from("settings")
      .update(req.body)
      .eq("key", "site")
      .select()
      .single();

    if (error) throw error;
    triggerUpdate("settings");
    res.json(settings);
  } catch (error) {
    next(error);
  }
};
