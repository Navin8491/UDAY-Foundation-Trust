import Setting from "../models/Setting.js";
import { triggerUpdate } from "../utils/realtime.js";

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne({ key: "site" });
    if (!settings) {
      // Return default empty setting or seed default
      settings = await Setting.create({ key: "site" });
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
    const settings = await Setting.findOneAndUpdate(
      { key: "site" },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );
    triggerUpdate("settings");
    res.json(settings);
  } catch (error) {
    next(error);
  }
};
