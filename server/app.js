import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import apiRouter from "./routes/api.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sanitizeNoSQL, sanitizeXSS } from "./middleware/validation.js";

const app = express();

// Enable trust proxy for express-rate-limit and accurate client IPs behind Render's load balancer
app.set("trust proxy", 1);

// Enable GZIP compression for all responses
app.use(compression());

// Force ETag revalidation for API requests
app.use((req, res, next) => {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
  }
  next();
});

const parsedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];

const defaultOrigins = [
  "http://localhost:5173",
  "https://www.udayfoundationstrust.org",
  "https://udayfoundationstrust.org",
  "https://www.udayfoundationtrust.org",
  "https://udayfoundationtrust.org",
  "https://uday-foundation-trust.vercel.app",
];

// Combine and deduplicate
const allowedOrigins = Array.from(new Set([...parsedOrigins, ...defaultOrigins]));

// Security Middleware (Helmet & CSP)
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow loading media from other domains
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: process.env.NODE_ENV === "production"
          ? ["'self'", "'unsafe-inline'"]
          : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://*.supabase.co"], // Allow loading images from Supabase Storage
        connectSrc: process.env.NODE_ENV === "production"
          ? ["'self'", ...allowedOrigins]
          : ["'self'", "http://localhost:*", "http://127.0.0.1:*", ...allowedOrigins],
      },
    },
  }),
);

// Allow Private Network Access (for accessing localhost:5000 from https://uday-foundation-trust.vercel.app)
app.use((req, res, next) => {
  if (req.headers["access-control-request-private-network"]) {
    res.setHeader("Access-Control-Allow-Private-Network", "true");
  }
  next();
});

// CORS Configuration (Least-privilege with localhost and Vercel DX support)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      const originLower = origin.toLowerCase();
      const isVercel = /^https:\/\/(.*\.)?vercel\.app$/.test(origin) || originLower.includes("vercel.app");
      const isUdayTrust = /^https:\/\/(.*\.)?udayfoundation(s)?trust\.org$/.test(origin) || 
                          originLower.includes("udayfoundationstrust.org") || 
                          originLower.includes("udayfoundationtrust.org");

      // Development only support for localhost/127.0.0.1
      if (isLocalhost) {
        if (process.env.NODE_ENV === "production") {
          return callback(null, false);
        }
        return callback(null, true);
      }

      if (isVercel || isUdayTrust || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Return false instead of an Error to reject the origin gracefully (no CORS headers)
        // without throwing a 500 Internal Server Error in the server logs.
        callback(null, false);
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Global sanitizers for NoSQL injection and XSS
app.use(sanitizeNoSQL);
app.use(sanitizeXSS);

// Request body parsers
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root welcome & health check route
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "UDAY Foundation Trust Backend API is running successfully!",
  });
});

// Mount API routes
app.use("/api", apiRouter);

// Centralized error handler
app.use(errorHandler);

export default app;
