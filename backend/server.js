import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/api.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { initRealtime } from "./utils/realtime.js";
import { sanitizeNoSQL, sanitizeXSS } from "./middleware/validation.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",");

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Initialize Socket.io utility
initRealtime(io);

// Security Middleware (Helmet & CSP)
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading media from other domains
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "ws:", "wss:", ...allowedOrigins],
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
