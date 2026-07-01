import { supabase } from "../config/db.js";
import { triggerUpdate } from "../utils/realtime.js";

// Fetch all notifications ordered by created_at DESC
export const getNotifications = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
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

    if (error) throw error;

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
      res.status(404);
      return next(new Error(error.message || "Notification not found"));
    }

    triggerUpdate("notifications");
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
};
