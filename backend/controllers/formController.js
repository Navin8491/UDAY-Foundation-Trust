import Volunteer from "../models/Volunteer.js";
import PartnershipRequest from "../models/PartnershipRequest.js";
import ContactMessage from "../models/ContactMessage.js";
import Donation from "../models/Donation.js";
import { triggerUpdate } from "../utils/realtime.js";

// Volunteers CRUD
export const getVolunteers = async (req, res, next) => {
  try {
    const list = await Volunteer.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

export const createVolunteer = async (req, res, next) => {
  try {
    const record = await Volunteer.create(req.body);
    triggerUpdate("volunteers");
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const updateVolunteerStatus = async (req, res, next) => {
  try {
    const record = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!record) {
      res.status(404);
      return next(new Error("Volunteer record not found"));
    }
    triggerUpdate("volunteers");
    res.json(record);
  } catch (error) {
    next(error);
  }
};

export const deleteVolunteer = async (req, res, next) => {
  try {
    const record = await Volunteer.findByIdAndDelete(req.params.id);
    if (!record) {
      res.status(404);
      return next(new Error("Volunteer record not found"));
    }
    triggerUpdate("volunteers");
    res.json({ message: "Volunteer record removed successfully" });
  } catch (error) {
    next(error);
  }
};

// Partnerships CRUD
export const getPartnerships = async (req, res, next) => {
  try {
    const list = await PartnershipRequest.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

export const createPartnership = async (req, res, next) => {
  try {
    const record = await PartnershipRequest.create(req.body);
    triggerUpdate("partnership_requests");
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const updatePartnershipStatus = async (req, res, next) => {
  try {
    const record = await PartnershipRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!record) {
      res.status(404);
      return next(new Error("Partnership record not found"));
    }
    triggerUpdate("partnership_requests");
    res.json(record);
  } catch (error) {
    next(error);
  }
};

export const deletePartnership = async (req, res, next) => {
  try {
    const record = await PartnershipRequest.findByIdAndDelete(req.params.id);
    if (!record) {
      res.status(404);
      return next(new Error("Partnership record not found"));
    }
    triggerUpdate("partnership_requests");
    res.json({ message: "Partnership record removed successfully" });
  } catch (error) {
    next(error);
  }
};

// Contact Messages CRUD
export const getContactMessages = async (req, res, next) => {
  try {
    const list = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

export const createContactMessage = async (req, res, next) => {
  try {
    const record = await ContactMessage.create(req.body);
    triggerUpdate("contact_messages");
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const record = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!record) {
      res.status(404);
      return next(new Error("Contact message not found"));
    }
    triggerUpdate("contact_messages");
    res.json({ message: "Contact message removed successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateContactMessageStatus = async (req, res, next) => {
  try {
    const record = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!record) {
      res.status(404);
      return next(new Error("Contact message not found"));
    }
    triggerUpdate("contact_messages");
    res.json(record);
  } catch (error) {
    next(error);
  }
};

// Donations CRUD
export const getDonations = async (req, res, next) => {
  try {
    const list = await Donation.find().sort({ date: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

export const createDonation = async (req, res, next) => {
  try {
    const record = await Donation.create(req.body);
    triggerUpdate("donations");
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};
