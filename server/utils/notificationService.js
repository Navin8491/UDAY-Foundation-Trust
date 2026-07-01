import { supabase } from "../config/db.js";
import { triggerUpdate } from "./realtime.js";

/**
 * Creates a notification in the database and triggers real-time updates.
 * @param {string} type - 'volunteer', 'partnership', 'donation', 'contact', 'event', 'program'
 * @param {string} title - Notification title
 * @param {string} message - Notification details
 * @param {string} [relatedRecordId] - ID of the related item
 */
export async function createNotification(type, title, message, relatedRecordId = null) {
  try {
    const payload = {
      type,
      title,
      message,
      related_record_id: relatedRecordId ? String(relatedRecordId) : null,
      read_status: false,
    };

    const { data, error } = await supabase
      .from("notifications")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("[NotificationService] Failed to insert notification in Supabase:", error.message);
      return null;
    }

    // Trigger realtime broadcast if Socket.IO is configured
    triggerUpdate("notifications");

    console.log(`🔔 Notification Created: [${type.toUpperCase()}] ${title}`);
    return data;
  } catch (err) {
    console.error("[NotificationService] Error creating notification:", err.message);
    return null;
  }
}
