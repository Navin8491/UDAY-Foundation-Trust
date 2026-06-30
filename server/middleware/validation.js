import { z } from "zod";

// NoSQL Injection sanitizer (removes keys starting with $)
export const sanitizeNoSQL = (req, res, next) => {
  const clean = (val) => {
    if (val instanceof Array) {
      for (let i = 0; i < val.length; i++) {
        if (typeof val[i] === "object") clean(val[i]);
      }
    } else if (val !== null && typeof val === "object") {
      Object.keys(val).forEach((key) => {
        if (key.startsWith("$")) {
          delete val[key];
        } else if (typeof val[key] === "object") {
          clean(val[key]);
        }
      });
    }
    return val;
  };

  if (req.body) clean(req.body);
  if (req.query) clean(req.query);
  if (req.params) clean(req.params);
  next();
};

// XSS Sanitizer - Escapes HTML characters in request bodies
// Skips fields that are explicitly meant for rich HTML text (e.g. desc, summary, objectives, activities, successStory, successQuote)
const ALLOWED_HTML_FIELDS = ["desc", "summary", "objectives", "activities", "successStory", "successQuote"];

export const sanitizeXSS = (req, res, next) => {
  const escapeHTML = (str) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  };

  const clean = (val, keyName = "") => {
    if (ALLOWED_HTML_FIELDS.includes(keyName)) {
      return val; // Skip escaping for rich HTML fields
    }

    if (typeof val === "string") {
      return escapeHTML(val);
    } else if (val instanceof Array) {
      return val.map((item) => clean(item, keyName));
    } else if (val !== null && typeof val === "object") {
      Object.keys(val).forEach((key) => {
        val[key] = clean(val[key], key);
      });
    }
    return val;
  };

  if (req.body) {
    req.body = clean(req.body);
  }
  next();
};

// Schema Validation Engine using Zod
export const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.errors.map(err => `${err.path.join(".")}: ${err.message}`).join(", ");
      res.status(400);
      return next(new Error(errorMessages));
    }
    // Re-assign sanitized & validated body (protects against mass assignment)
    req.body = result.data;
    next();
  };
};

// Zod Validation Schemas
export const loginSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const volunteerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email address"),
  phone: z.string().regex(/^\+?[0-9\s-]{8,25}$/, "Must be a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  education: z.string().min(2, "Education must be at least 2 characters"),
  photoUrl: z.string().optional().or(z.literal("")),
  idProofUrl: z.string().min(1, "ID proof document is required"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  message: z.string().optional().or(z.literal("")),
  
  // Extended fields
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pincode: z.string().min(1, "Pincode is required"),
  occupation: z.string().min(1, "Occupation is required"),
  skills: z.string().min(1, "Skills are required"),
  languages: z.string().min(1, "Languages are required"),
  experience: z.string().min(1, "Previous experience is required"),
  availability: z.string().min(1, "Availability is required"),
  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyPhone: z.string().min(1, "Emergency contact phone is required"),
  resumeUrl: z.string().optional().or(z.literal("")),
});

export const donationSchema = z.object({
  donorName: z.string().min(2, "Donor name must be at least 2 characters"),
  email: z.string().email("Must be a valid email address"),
  phone: z.string().regex(/^\+?[0-9\s-]{8,25}$/, "Must be a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  panNumber: z.string().min(10, "PAN number must be 10 characters").max(10),
  amount: z.number().min(1, "Donation amount must be at least 1"),
  purpose: z.string().min(2, "Purpose must be specified"),
});

export const partnershipSchema = z.object({
  organization: z.string().min(2, "Organization name must be at least 2 characters"),
  contactPerson: z.string().min(2, "Contact person name must be at least 2 characters"),
  email: z.string().email("Must be a valid email address"),
  phone: z.string().regex(/^\+?[0-9\s-]{8,25}$/, "Must be a valid phone number"),
  message: z.string().optional(), // kept for backward compatibility
  type: z.string().min(2, "Partnership type must be specified"),

  // Extended fields
  website: z.string().optional().or(z.literal("")),
  address: z.string().min(2, "Address must be specified"),
  proposal: z.string().min(5, "Proposal description must be at least 5 characters"),
  documentUrl: z.string().min(1, "Proposal document is required"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email address"),
  phone: z.string().regex(/^\+?[0-9\s-]{8,25}$/, "Must be a valid phone number"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});
