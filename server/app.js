import express from "express";
import cors from "cors";
import helmet from "helmet";
import apiRouter from "./routes/api.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sanitizeNoSQL, sanitizeXSS } from "./middleware/validation.js";

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",");

// Security Middleware (Helmet & CSP)
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading media from other domains
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://*.supabase.co"], // Allow loading images from Supabase Storage
      connectSrc: ["'self'", ...allowedOrigins],
    }
  }
}));

// CORS Configuration (Least-privilege)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Global sanitizers for NoSQL injection and XSS
app.use(sanitizeNoSQL);
app.use(sanitizeXSS);

// Request body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Mount API routes
app.use("/api", apiRouter);

// Centralized error handler
app.use(errorHandler);

export default app;
