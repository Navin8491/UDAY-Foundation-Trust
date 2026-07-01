import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import apiRouter from "./routes/api.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sanitizeNoSQL, sanitizeXSS } from "./middleware/validation.js";

const app = express();

// Enable GZIP compression for all responses
app.use(compression());

// Force ETag revalidation for API requests
app.use((req, res, next) => {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
  }
  next();
});

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
      connectSrc: ["'self'", "http://localhost:*", "http://127.0.0.1:*", ...allowedOrigins],
    }
  }
}));

// Allow Private Network Access (for accessing localhost:5000 from https://uday-foundation-trust.vercel.app)
app.use((req, res, next) => {
  if (req.headers["access-control-request-private-network"]) {
    res.setHeader("Access-Control-Allow-Private-Network", "true");
  }
  next();
});

// CORS Configuration (Least-privilege with localhost and Vercel DX support)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const isVercel = /^https:\/\/.*\.vercel\.app$/.test(origin);
    const isUdayTrust = /^https:\/\/(.*\.)?udayfoundation(s)?trust\.org$/.test(origin);
    if (isLocalhost || isVercel || isUdayTrust || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Return false instead of an Error to reject the origin gracefully (no CORS headers)
      // without throwing a 500 Internal Server Error in the server logs.
      callback(null, false);
    }
  },
  credentials: true,
}));

// Global sanitizers for NoSQL injection and XSS
app.use(sanitizeNoSQL);
app.use(sanitizeXSS);

// Request body parsers
app.use(express.json({
  limit: "10mb",
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root welcome & health check route
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "UDAY Foundation Trust Backend API is running successfully!"
  });
});

// Mount API routes
app.use("/api", apiRouter);

// Centralized error handler
app.use(errorHandler);

export default app;
