import { supabase } from "../config/db.js";
import { deleteFile } from "../services/storageService.js";
import { triggerUpdate } from "../utils/realtime.js";
import { syncEventGallery, extractImageUrls } from "../utils/gallerySync.js";
import { createNotification } from "../utils/notificationService.js";

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

    // Auto-sync event images → gallery (fire-and-forget, non-blocking)
    if (event.images && Array.isArray(event.images)) {
      syncEventGallery(event.category, event.images, []).catch((err) =>
        console.error("[GallerySync] Create sync error:", err.message)
      );
    }

    // Create admin notification
    createNotification(
      "event",
      "New Event Created",
      `Event "${event.title?.en || req.body.title?.en || "Untitled Event"}" has been created.`,
      event.id
    );

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
    // Fetch the PREVIOUS state so we can diff old images vs new images
    const { data: prevEvent } = await supabase
      .from("events")
      .select("images, category")
      .eq("id", req.params.id)
      .single();

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

    // Sync gallery: diff previous images vs current images
    const oldImages = prevEvent?.images || [];
    const newImages = event.images || [];
    syncEventGallery(
      event.category || req.body.category,
      newImages,
      oldImages
    ).catch((err) =>
      console.error("[GallerySync] Update sync error:", err.message)
    );

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

    // Build the full list of URLs (cover + gallery images)
    // extractImageUrls handles both string[] and {img,...}[] formats
    const allUrls = [];
    if (event.img && typeof event.img === "string") {
      allUrls.push(event.img);
    }
    extractImageUrls(event.images || []).forEach((url) => {
      if (!allUrls.includes(url)) allUrls.push(url);
    });

    if (allUrls.length > 0) {
      // Remove matching gallery items
      const { error: galleryDeleteError } = await supabase
        .from("gallery")
        .delete()
        .in("img", allUrls);

      if (galleryDeleteError) {
        console.error("[GallerySync] Gallery cleanup error:", galleryDeleteError.message);
      } else {
        console.log(`[GallerySync] Removed ${allUrls.length} gallery item(s) for deleted event.`);
      }
      triggerUpdate("gallery");

      // Delete files from Supabase Storage
      allUrls.forEach((url) => {
        deleteFile(url).catch((err) =>
          console.error("Failed to delete event image from storage:", err)
        );
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
