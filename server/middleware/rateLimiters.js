import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

// Brute-force protection for admin login
export const authLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS) || 15 * 60 * 1000, // default 15 minutes
  max: Number(process.env.RATE_LIMIT_AUTH_MAX) || 5, // default 5 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts from this IP, please try again after 15 minutes",
  },
  statusCode: 429
});

// Spam protection for public forms (contact, volunteers, partnerships, donations)
export const publicFormLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_FORM_WINDOW_MS) || 60 * 60 * 1000, // default 1 hour
  max: Number(process.env.RATE_LIMIT_FORM_MAX) || 10, // default 10 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many submissions from this IP, please try again after an hour",
  },
  statusCode: 429
});

// General limiter for public read operations
export const generalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_GENERAL_WINDOW_MS) || 15 * 60 * 1000, // default 15 minutes
  max: Number(process.env.RATE_LIMIT_GENERAL_MAX) || 300, // default 300 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
  statusCode: 429
});
