// NoSQL Injection sanitizer
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
// Skips fields that are explicitly meant for rich HTML text (e.g. desc, summary, objectives, activities, successStory)
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

// Schema Validation Engine
export const validateBody = (schema) => {
  return (req, res, next) => {
    const errors = [];
    Object.keys(schema).forEach((key) => {
      const rule = schema[key];
      const val = req.body[key];

      if (rule.required && (val === undefined || val === null || val === "")) {
        errors.push(`${key} is required.`);
        return;
      }

      if (val !== undefined && val !== null && val !== "") {
        if (rule.type === "string" && typeof val !== "string") {
          errors.push(`${key} must be a string.`);
        }
        if (rule.type === "number" && (typeof val !== "number" || isNaN(val))) {
          errors.push(`${key} must be a number.`);
        }
        if (rule.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          errors.push(`${key} must be a valid email address.`);
        }
        if (rule.type === "phone" && !/^\+?[0-9\s-]{8,25}$/.test(val)) {
          errors.push(`${key} must be a valid phone number.`);
        }
        if (rule.type === "url" && !/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val)) {
          errors.push(`${key} must be a valid HTTP/HTTPS URL.`);
        }
        if (rule.min !== undefined) {
          if (rule.type === "number" && val < rule.min) {
            errors.push(`${key} must be at least ${rule.min}.`);
          }
          if (rule.type === "string" && val.length < rule.min) {
            errors.push(`${key} must be at least ${rule.min} characters.`);
          }
        }
      }
    });

    if (errors.length > 0) {
      res.status(400);
      return next(new Error(errors.join(" ")));
    }
    next();
  };
};

// Validation Schemas
export const loginSchema = {
  email: { type: "email", required: true },
  password: { type: "string", required: true, min: 6 },
};

export const volunteerSchema = {
  name: { type: "string", required: true, min: 2 },
  email: { type: "email", required: true },
  phone: { type: "phone", required: true },
  address: { type: "string", required: true },
  education: { type: "string", required: true },
  photoUrl: { type: "url", required: true },
  idProofUrl: { type: "url", required: true },
  role: { type: "string", required: true },
};

export const donationSchema = {
  donorName: { type: "string", required: true, min: 2 },
  email: { type: "email", required: true },
  phone: { type: "phone", required: true },
  amount: { type: "number", required: true, min: 1 },
};

export const partnershipSchema = {
  orgName: { type: "string", required: true, min: 2 },
  contactName: { type: "string", required: true, min: 2 },
  email: { type: "email", required: true },
  phone: { type: "phone", required: true },
  message: { type: "string", required: true },
  documentUrl: { type: "url", required: true },
};

export const contactSchema = {
  name: { type: "string", required: true, min: 2 },
  email: { type: "email", required: true },
  phone: { type: "phone", required: true },
  message: { type: "string", required: true },
};
