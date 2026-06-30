import { supabase } from "../config/db.js";
import { deleteFile } from "../services/storageService.js";
import { triggerUpdate } from "../utils/realtime.js";

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(events || []);
  } catch (error) {
    next(error);
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res, next) => {
  try {
    const { data: event, error } = await supabase
      .from("events")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;

    triggerUpdate("events");
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res, next) => {
  try {
    const { data: event, error } = await supabase
      .from("events")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      res.status(404);
      return next(new Error(error.message || "Event not found"));
    }
    triggerUpdate("events");
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res, next) => {
  try {
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("img, images")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !event) {
      res.status(404);
      return next(new Error("Event not found"));
    }

    const allUrls = [];
    if (event.img) allUrls.push(event.img);
    if (event.images && Array.isArray(event.images)) {
      event.images.forEach(imgUrl => {
        if (imgUrl) allUrls.push(imgUrl);
      });
    }

    if (allUrls.length > 0) {
      // Delete matching gallery items
      await supabase.from("gallery").delete().in("img", allUrls);
      triggerUpdate("gallery");

      // Delete from Storage
      allUrls.forEach(url => {
        deleteFile(url).catch(err => console.error("Failed to delete event image from storage:", err));
      });
    }

    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", req.params.id);

    if (deleteError) throw deleteError;

    triggerUpdate("events");
    res.json({ message: "Event removed successfully" });
  } catch (error) {
    next(error);
  }
};
