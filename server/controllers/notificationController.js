import { supabase } from "../config/db.js";
import { triggerUpdate } from "../utils/realtime.js";

// Helper to check if database error is due to missing table
const isTableMissingError = (error) => {
  return error && (error.code === "42P01" || (error.message && error.message.includes("does not exist")));
};

// Fetch all notifications ordered by created_at DESC
export const getNotifications = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (isTableMissingError(error)) {
        console.warn("⚠️ [NotificationController] notifications table not found in database. Returning empty array.");
        return res.json([]);
      }
      throw error;
    }
    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

// Mark a specific notification as read
export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("notifications")
      .update({ read_status: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isTableMissingError(error)) {
        console.warn("⚠️ [NotificationController] notifications table not found in database.");
        return res.json({ id, read_status: true });
      }
      res.status(404);
      return next(new Error(error.message || "Notification not found"));
    }

    triggerUpdate("notifications");
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Mark all unread notifications as read
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({ read_status: true })
      .eq("read_status", false)
      .select();

    if (error) {
      if (isTableMissingError(error)) {
        console.warn("⚠️ [NotificationController] notifications table not found in database.");
        return res.json({ message: "All notifications marked as read", count: 0 });
      }
      throw error;
    }

    triggerUpdate("notifications");
    res.json({ message: "All notifications marked as read", count: data?.length || 0 });
  } catch (error) {
    next(error);
  }
};

// Delete a notification
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (error) {
      if (isTableMissingError(error)) {
        console.warn("⚠️ [NotificationController] notifications table not found in database.");
        return res.json({ message: "Notification deleted successfully" });
      }
      res.status(404);
      return next(new Error(error.message || "Notification not found"));
    }

    triggerUpdate("notifications");
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
};
