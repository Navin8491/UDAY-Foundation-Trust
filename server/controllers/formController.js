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
  sendDonationReceived,
} from "../utils/emailService.js";
import { createNotification } from "../utils/notificationService.js";

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

    let result = await supabase.from("volunteers").insert([fullPayload]).select().single();

    // Fallback if the Supabase database schema lacks the new columns
    if (
      result.error &&
      (result.error.message.includes("column") || result.error.code === "PGRST204")
    ) {
      console.warn(
        "[Backend Fallback] Database columns not found. Saving details inside message JSON string...",
      );
      result = await supabase.from("volunteers").insert([basePayload]).select().single();
    }

    if (result.error) throw result.error;
    const data = result.data;

    // Send acknowledgement email to user
    sendVolunteerReceived(email, name).catch((err) =>
      console.error("[EmailService] Failed to send volunteer confirmation:", err.message),
    );

    // Send admin notification
    sendAdminAlert("volunteer", name, {
      Email: email,
      Phone: phone,
      City: city || "Gujarat",
      Role: role,
      "Applied At": new Date().toLocaleString(),
    }).catch((err) => console.error("[EmailService] Failed to send admin alert:", err.message));

    // Create admin notification
    createNotification(
      "volunteer",
      "New Volunteer Application",
      `${name} has applied to become a volunteer.`,
      data.id,
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
      action:
        status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Marked Pending",
      admin: adminEmail,
      date: new Date().toISOString(),
      notes:
        status === "rejected" && reason
          ? `Rejection reason: ${reason}`
          : `Status updated to ${status}.`,
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
        console.error("[EmailService] Approved status email failed:", err.message),
      );
    } else if (status === "rejected") {
      sendVolunteerRejected(current.email, current.name, reason).catch((err) =>
        console.error("[EmailService] Rejected status email failed:", err.message),
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
    const { error } = await supabase.from("volunteers").delete().eq("id", req.params.id);

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

    const { data, error } = await supabase.from("partnerships").insert([payload]).select().single();

    if (error) throw error;

    // Send confirmation email to client
    sendPartnershipReceived(email, contactPerson, organization).catch((err) =>
      console.error("[EmailService] Failed to send partnership confirmation:", err.message),
    );

    // Send admin notification
    sendAdminAlert("partnership", contactPerson, {
      Organization: organization,
      Email: email,
      Phone: phone,
      Type: type,
      "Applied At": new Date().toLocaleString(),
    }).catch((err) => console.error("[EmailService] Failed to send admin alert:", err.message));

    // Create admin notification
    createNotification(
      "partnership",
      "New Partnership Request",
      `${organization} submitted a partnership request.`,
      data.id,
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
      action:
        status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Marked Pending",
      admin: adminEmail,
      date: new Date().toISOString(),
      notes:
        status === "rejected" && reason
          ? `Rejection reason: ${reason}`
          : `Status updated to ${status}.`,
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
        console.error("[EmailService] Approved status email failed:", err.message),
      );
    } else if (status === "rejected") {
      sendPartnershipRejected(current.email, current.contactName, current.orgName, reason).catch(
        (err) => console.error("[EmailService] Rejected status email failed:", err.message),
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
    const { error } = await supabase.from("partnerships").delete().eq("id", req.params.id);

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

    // Send admin notification
    sendAdminAlert("contact", req.body.name, {
      Email: req.body.email,
      Subject: req.body.subject,
      Message: req.body.message,
      "Submitted At": new Date().toLocaleString(),
    }).catch((err) => console.error("[EmailService] Failed to send contact admin alert:", err.message));

    // Create admin notification
    createNotification(
      "contact",
      "New Contact Message",
      `New inquiry: "${req.body.subject}" from ${req.body.name}.`,
      data.id,
    );

    triggerUpdate("contact_messages");
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const { error } = await supabase.from("contact_messages").delete().eq("id", req.params.id);

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
    const { data, error } = await supabase.from("donations").insert([req.body]).select().single();

    if (error) throw error;

    // Generate PDF invoice and send thank you confirmation email to donor
    (async () => {
      try {
        const { generateReceiptPdf } = await import("../utils/pdfGenerator.js");
        const pdfBuffer = await generateReceiptPdf(data).catch(() => null);
        await sendDonationReceived(
          data.email,
          data.donorName,
          data.amount,
          data.id,
          data.panNumber,
          data.receiptNumber || `UFT/REC-${data.id.substring(0, 8).toUpperCase()}`,
          pdfBuffer
        );
      } catch (err) {
        console.error("[EmailService] Failed to send donation confirmation email:", err.message);
      }
    })();

    // Send admin notification email
    sendAdminAlert("donation", data.donorName, {
      Email: data.email,
      Amount: `₹${Number(data.amount).toLocaleString("en-IN")}`,
      Purpose: data.purpose || "General Donation",
      "Receipt Number": data.receiptNumber || `UFT/REC-${data.id.substring(0, 8).toUpperCase()}`,
      "Submitted At": new Date().toLocaleString(),
    }).catch((err) => console.error("[EmailService] Failed to send admin donation alert:", err.message));

    // Create admin notification
    createNotification(
      "donation",
      "New Donation Received",
      `₹${Number(data.amount).toLocaleString("en-IN")} donated by ${data.donorName}.`,
      data.id,
    );

    triggerUpdate("donations");
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

// Helper to write database audit logs
const createAuditLog = async (req, action, oldVal, newVal) => {
  try {
    const adminName = req.user?.email || "admin@udayfoundationstrust.org";
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    await supabase.from("audit_logs").insert([
      {
        admin_name: adminName,
        action,
        ip_address: ipAddress,
        old_value: oldVal,
        new_value: newVal,
      }
    ]);
  } catch (err) {
    console.error("[AuditLog] Failed to insert log:", err.message);
  }
};

// Update Volunteer profile details
export const updateVolunteer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminEmail = req.user?.email || "admin@udayfoundationstrust.org";

    const { data: current, error: fetchErr } = await supabase
      .from("volunteers")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !current) {
      res.status(404);
      return next(new Error("Volunteer record not found"));
    }

    const {
      name,
      email,
      phone,
      address,
      education,
      photoUrl,
      idProofUrl,
      role,
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
      status,
    } = req.body;

    const parsedMsg = parseExtendedMessage(current.message);
    if (!parsedMsg.timeline) parsedMsg.timeline = [];

    // Log the edit action to timeline
    parsedMsg.timeline.push({
      action: "Edited",
      admin: adminEmail,
      date: new Date().toISOString(),
      notes: "Volunteer profile details updated by admin.",
    });

    const updatePayload = {
      name: name !== undefined ? name : current.name,
      email: email !== undefined ? email : current.email,
      phone: phone !== undefined ? phone : current.phone,
      address: address !== undefined ? address : current.address,
      education: education !== undefined ? education : current.education,
      photoUrl: photoUrl !== undefined ? photoUrl : current.photoUrl,
      idProofUrl: idProofUrl !== undefined ? idProofUrl : current.idProofUrl,
      role: role !== undefined ? role : current.role,
      dob: dob !== undefined ? dob : current.dob,
      gender: gender !== undefined ? gender : current.gender,
      city: city !== undefined ? city : current.city,
      state: state !== undefined ? state : current.state,
      country: country !== undefined ? country : current.country,
      pincode: pincode !== undefined ? pincode : current.pincode,
      occupation: occupation !== undefined ? occupation : current.occupation,
      skills: skills !== undefined ? skills : current.skills,
      languages: languages !== undefined ? languages : current.languages,
      experience: experience !== undefined ? experience : current.experience,
      availability: availability !== undefined ? availability : current.availability,
      emergencyName: emergencyName !== undefined ? emergencyName : current.emergencyName,
      emergencyPhone: emergencyPhone !== undefined ? emergencyPhone : current.emergencyPhone,
      resumeUrl: resumeUrl !== undefined ? resumeUrl : current.resumeUrl,
      status: status !== undefined ? status : current.status,
      message: JSON.stringify({
        ...parsedMsg,
        isExtended: true,
      }),
    };

    const { data: updated, error } = await supabase
      .from("volunteers")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Email trigger on status change
    if (status && status !== current.status) {
      if (status === "approved") {
        sendVolunteerApproved(updated.email, updated.name).catch((err) =>
          console.error("[EmailService] Approved status email failed:", err.message),
        );
      } else if (status === "rejected") {
        sendVolunteerRejected(updated.email, updated.name, "Profile details updated by admin").catch((err) =>
          console.error("[EmailService] Rejected status email failed:", err.message),
        );
      }
    }

    // Write to audit log
    await createAuditLog(req, "UPDATE_VOLUNTEER", current, updated);

    triggerUpdate("volunteers");
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Update Partnership details
export const updatePartnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminEmail = req.user?.email || "admin@udayfoundationstrust.org";

    const { data: current, error: fetchErr } = await supabase
      .from("partnerships")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !current) {
      res.status(404);
      return next(new Error("Partnership record not found"));
    }

    const {
      orgName,
      contactName,
      email,
      phone,
      type,
      documentUrl,
      status,
      website,
      address,
      proposal,
    } = req.body;

    const parsedMsg = parseExtendedMessage(current.message);
    if (!parsedMsg.timeline) parsedMsg.timeline = [];

    // Log edit to timeline
    parsedMsg.timeline.push({
      action: "Edited",
      admin: adminEmail,
      date: new Date().toISOString(),
      notes: "Partnership details updated by admin.",
    });

    const updatePayload = {
      orgName: orgName !== undefined ? orgName : current.orgName,
      contactName: contactName !== undefined ? contactName : current.contactName,
      email: email !== undefined ? email : current.email,
      phone: phone !== undefined ? phone : current.phone,
      type: type !== undefined ? type : current.type,
      documentUrl: documentUrl !== undefined ? documentUrl : current.documentUrl,
      status: status !== undefined ? status : current.status,
      message: JSON.stringify({
        ...parsedMsg,
        website: website !== undefined ? website : (parsedMsg.website || ""),
        address: address !== undefined ? address : (parsedMsg.address || ""),
        proposal: proposal !== undefined ? proposal : (parsedMsg.proposal || ""),
        isExtended: true,
      }),
    };

    const { data: updated, error } = await supabase
      .from("partnerships")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Email trigger on status change
    if (status && status !== current.status) {
      if (status === "approved") {
        sendPartnershipApproved(updated.email, updated.contactName, updated.orgName).catch((err) =>
          console.error("[EmailService] Approved status email failed:", err.message),
        );
      } else if (status === "rejected") {
        sendPartnershipRejected(updated.email, updated.contactName, updated.orgName, "Profile details updated by admin").catch((err) =>
          console.error("[EmailService] Rejected status email failed:", err.message),
        );
      }
    }

    // Write to audit log
    await createAuditLog(req, "UPDATE_PARTNERSHIP", current, updated);

    triggerUpdate("partnership_requests");
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

