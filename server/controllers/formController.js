import { supabase } from "../config/db.js";
import { triggerUpdate } from "../utils/realtime.js";

// Volunteers CRUD
export const getVolunteers = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const createVolunteer = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("volunteers")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    triggerUpdate("volunteers");
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateVolunteerStatus = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("volunteers")
      .update({ status: req.body.status })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      res.status(404);
      return next(new Error(error.message || "Volunteer record not found"));
    }
    triggerUpdate("volunteers");
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteVolunteer = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from("volunteers")
      .delete()
      .eq("id", req.params.id);

    if (error) {
      res.status(404);
      return next(new Error(error.message || "Volunteer record not found"));
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
    const { data, error } = await supabase
      .from("partnerships")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const createPartnership = async (req, res, next) => {
  try {
    // Map organization -> orgName, contactPerson -> contactName if necessary, 
    // but the frontend already maps it or the backend schema requires mapping:
    const payload = {
      orgName: req.body.organization || req.body.orgName,
      contactName: req.body.contactPerson || req.body.contactName,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
      documentUrl: req.body.documentUrl,
      type: req.body.type,
      status: req.body.status || "pending",
    };

    const { data, error } = await supabase
      .from("partnerships")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    triggerUpdate("partnership_requests");
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updatePartnershipStatus = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("partnerships")
      .update({ status: req.body.status })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      res.status(404);
      return next(new Error(error.message || "Partnership record not found"));
    }
    triggerUpdate("partnership_requests");
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deletePartnership = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from("partnerships")
      .delete()
      .eq("id", req.params.id);

    if (error) {
      res.status(404);
      return next(new Error(error.message || "Partnership record not found"));
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
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const createContactMessage = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    triggerUpdate("contact_messages");
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", req.params.id);

    if (error) {
      res.status(404);
      return next(new Error(error.message || "Contact message not found"));
    }
    triggerUpdate("contact_messages");
    res.json({ message: "Contact message removed successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateContactMessageStatus = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ status: req.body.status })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      res.status(404);
      return next(new Error(error.message || "Contact message not found"));
    }
    triggerUpdate("contact_messages");
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Donations CRUD
export const getDonations = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const createDonation = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("donations")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    triggerUpdate("donations");
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
