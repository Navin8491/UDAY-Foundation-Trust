import Event from "../models/Event.js";
import Gallery from "../models/Gallery.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";
import { triggerUpdate } from "../utils/realtime.js";

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
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
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      res.status(404);
      return next(new Error("Event not found"));
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
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      return next(new Error("Event not found"));
    }

    // Delete related gallery items that match the event's image URLs
    const allUrls = [];
    if (event.img) allUrls.push(event.img);
    if (event.images && Array.isArray(event.images)) {
      event.images.forEach(imgUrl => {
        if (imgUrl) allUrls.push(imgUrl);
      });
    }

    if (allUrls.length > 0) {
      await Gallery.deleteMany({ img: { $in: allUrls } });
      triggerUpdate("gallery");

      // Delete from Cloudinary asynchronously in background to not block response
      allUrls.forEach(url => {
        deleteFromCloudinary(url).catch(err => console.error("Failed to delete event image from Cloudinary:", err));
      });
    }

    await event.deleteOne();
    triggerUpdate("events");
    res.json({ message: "Event removed successfully" });
  } catch (error) {
    next(error);
  }
};
