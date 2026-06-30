import { supabase } from "../config/db.js";
import { triggerUpdate } from "../utils/realtime.js";
import {
  sendVolunteerReceived,
  sendPartnershipReceived,
  sendVolunteerApproved,
  sendPartnershipApproved,
  sendVolunteerRejected,
  sendPartnershipRejected,
  sendAdminAlert,
} from "../utils/emailService.js";

// Helper to safely parse JSON message payload
const parseExtendedMessage = (messageStr) => {
  if (!messageStr) return { isExtended: false, whyJoin: "" };
  try {
    const parsed = JSON.parse(messageStr);
    if (parsed && typeof parsed === "object" && parsed.isExtended) {
      return parsed;
    }
  } catch (e) {
    // Not a JSON string — treat as standard plain message
  }
  return { isExtended: false, whyJoin: messageStr };
};

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
    const {
      name,
      email,
      phone,
      address,
      education,
      photoUrl,
      idProofUrl,
      role,
      message, // acts as whyJoin
      dob,
      gender,
      city,
      state,
      country,
      pincode,
      occupation,
      skills,
      languages,
      experience,
      availability,
      emergencyName,
      emergencyPhone,
      resumeUrl,
    } = req.body;

    const extendedObj = {
      isExtended: true,
      whyJoin: message || "",
      notes: [],
      timeline: [
        {
          action: "Submitted",
          admin: null,
          date: new Date().toISOString(),
          notes: "Application submitted successfully via website form.",
        },
      ],
    };

    const basePayload = {
      name,
      email,
      phone,
      address,
      education,
      photoUrl: photoUrl || "",
      idProofUrl,
      role,
      message: JSON.stringify(extendedObj),
      status: "pending",
    };

    const fullPayload = {
      ...basePayload,
      dob: dob || "",
      gender: gender || "",
      city: city || "",
      state: state || "",
      country: country || "India",
      pincode: pincode || "",
      occupation: occupation || "",
      skills: skills || "",
      languages: languages || "",
      experience: experience || "",
      availability: availability || "",
      emergencyName: emergencyName || "",
      emergencyPhone: emergencyPhone || "",
      resumeUrl: resumeUrl || "",
    };

    let result = await supabase
      .from("volunteers")
      .insert([fullPayload])
      .select()
      .single();

    // Fallback if the Supabase database schema lacks the new columns
    if (result.error && (result.error.message.includes("column") || result.error.code === "PGRST204")) {
      console.warn("[Backend Fallback] Database columns not found. Saving details inside message JSON string...");
      result = await supabase
        .from("volunteers")
        .insert([basePayload])
        .select()
        .single();
    }

    if (result.error) throw result.error;
    const data = result.data;

    // Send acknowledgement email to user
    sendVolunteerReceived(email, name).catch((err) =>
      console.error("[EmailService] Failed to send volunteer confirmation:", err.message)
    );

    // Send admin notification
    sendAdminAlert("volunteer", name, {
      Email: email,
      Phone: phone,
      City: city || "Gujarat",
      Role: role,
      "Applied At": new Date().toLocaleString(),
    }).catch((err) =>
      console.error("[EmailService] Failed to send admin alert:", err.message)
    );

    triggerUpdate("volunteers");
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateVolunteerStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const adminEmail = req.user?.email || "admin@udayfoundationtrust.org";

    // 1. Fetch current application to update its timeline
    const { data: current, error: fetchErr } = await supabase
      .from("volunteers")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchErr || !current) {
      res.status(404);
      return next(new Error("Volunteer record not found"));
    }

    const parsedMsg = parseExtendedMessage(current.message);
    
    // Ensure notes and timeline arrays exist
    if (!parsedMsg.notes) parsedMsg.notes = [];
    if (!parsedMsg.timeline) parsedMsg.timeline = [];

    // Append to timeline
    parsedMsg.timeline.push({
      action: status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Marked Pending",
      admin: adminEmail,
      date: new Date().toISOString(),
      notes: status === "rejected" && reason ? `Rejection reason: ${reason}` : `Status updated to ${status}.`,
    });

    const { data, error } = await supabase
      .from("volunteers")
      .update({
        status,
        message: JSON.stringify({
          ...parsedMsg,
          isExtended: true, // ensure it's flagged
        }),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Send email notification based on status
    if (status === "approved") {
      sendVolunteerApproved(current.email, current.name).catch((err) =>
        console.error("[EmailService] Approved status email failed:", err.message)
      );
    } else if (status === "rejected") {
      sendVolunteerRejected(current.email, current.name, reason).catch((err) =>
        console.error("[EmailService] Rejected status email failed:", err.message)
      );
    }

    triggerUpdate("volunteers");
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const addVolunteerNote = async (req, res, next) => {
  try {
    const { text } = req.body;
    const adminEmail = req.user?.email || "admin@udayfoundationtrust.org";

    if (!text || !text.trim()) {
      res.status(400);
      return next(new Error("Note text cannot be empty"));
    }

    const { data: current, error: fetchErr } = await supabase
      .from("volunteers")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchErr || !current) {
      res.status(404);
      return next(new Error("Volunteer record not found"));
    }

    const parsedMsg = parseExtendedMessage(current.message);
    if (!parsedMsg.notes) parsedMsg.notes = [];
    if (!parsedMsg.timeline) parsedMsg.timeline = [];

    // Append internal note
    parsedMsg.notes.push({
      admin: adminEmail,
      text: text.trim(),
      date: new Date().toISOString(),
    });

    // Append note action to timeline
    parsedMsg.timeline.push({
      action: "Note Added",
      admin: adminEmail,
      date: new Date().toISOString(),
      notes: `Note details: "${text.substring(0, 30)}..."`,
    });

    const { data, error } = await supabase
      .from("volunteers")
      .update({
        message: JSON.stringify({
          ...parsedMsg,
          isExtended: true,
        }),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
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
    const {
      organization,
      contactPerson,
      email,
      phone,
      website,
      address,
      type,
      proposal, // acts as description/message
      documentUrl,
    } = req.body;

    const extendedObj = {
      isExtended: true,
      website: website || "",
      address: address || "",
      proposal: proposal || "",
      notes: [],
      timeline: [
        {
          action: "Submitted",
          admin: null,
          date: new Date().toISOString(),
          notes: "Partnership inquiry submitted successfully via website form.",
        },
      ],
    };

    const payload = {
      orgName: organization || req.body.orgName,
      contactName: contactPerson || req.body.contactName,
      email,
      phone,
      type,
      message: JSON.stringify(extendedObj),
      documentUrl: documentUrl || "",
      status: "pending",
    };

    const { data, error } = await supabase
      .from("partnerships")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    // Send confirmation email to client
    sendPartnershipReceived(email, contactPerson, organization).catch((err) =>
      console.error("[EmailService] Failed to send partnership confirmation:", err.message)
    );

    // Send admin notification
    sendAdminAlert("partnership", contactPerson, {
      Organization: organization,
      Email: email,
      Phone: phone,
      Type: type,
      "Applied At": new Date().toLocaleString(),
    }).catch((err) =>
      console.error("[EmailService] Failed to send admin alert:", err.message)
    );

    triggerUpdate("partnership_requests");
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updatePartnershipStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const adminEmail = req.user?.email || "admin@udayfoundationtrust.org";

    const { data: current, error: fetchErr } = await supabase
      .from("partnerships")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchErr || !current) {
      res.status(404);
      return next(new Error("Partnership record not found"));
    }

    const parsedMsg = parseExtendedMessage(current.message);
    if (!parsedMsg.notes) parsedMsg.notes = [];
    if (!parsedMsg.timeline) parsedMsg.timeline = [];

    parsedMsg.timeline.push({
      action: status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Marked Pending",
      admin: adminEmail,
      date: new Date().toISOString(),
      notes: status === "rejected" && reason ? `Rejection reason: ${reason}` : `Status updated to ${status}.`,
    });

    const { data, error } = await supabase
      .from("partnerships")
      .update({
        status,
        message: JSON.stringify({
          ...parsedMsg,
          isExtended: true,
        }),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Send email notification based on status
    if (status === "approved") {
      sendPartnershipApproved(current.email, current.contactName, current.orgName).catch((err) =>
        console.error("[EmailService] Approved status email failed:", err.message)
      );
    } else if (status === "rejected") {
      sendPartnershipRejected(current.email, current.contactName, current.orgName, reason).catch((err) =>
        console.error("[EmailService] Rejected status email failed:", err.message)
      );
    }

    triggerUpdate("partnership_requests");
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const addPartnershipNote = async (req, res, next) => {
  try {
    const { text } = req.body;
    const adminEmail = req.user?.email || "admin@udayfoundationtrust.org";

    if (!text || !text.trim()) {
      res.status(400);
      return next(new Error("Note text cannot be empty"));
    }

    const { data: current, error: fetchErr } = await supabase
      .from("partnerships")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchErr || !current) {
      res.status(404);
      return next(new Error("Partnership record not found"));
    }

    const parsedMsg = parseExtendedMessage(current.message);
    if (!parsedMsg.notes) parsedMsg.notes = [];
    if (!parsedMsg.timeline) parsedMsg.timeline = [];

    parsedMsg.notes.push({
      admin: adminEmail,
      text: text.trim(),
      date: new Date().toISOString(),
    });

    parsedMsg.timeline.push({
      action: "Note Added",
      admin: adminEmail,
      date: new Date().toISOString(),
      notes: `Note details: "${text.substring(0, 30)}..."`,
    });

    const { data, error } = await supabase
      .from("partnerships")
      .update({
        message: JSON.stringify({
          ...parsedMsg,
          isExtended: true,
        }),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
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
