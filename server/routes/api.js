import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { loginAdmin, verifyAdminToken } from "../controllers/authController.js";
import {
  uploadFile,
  uploadEventImage,
  uploadGalleryImage,
  uploadProgramImage,
  uploadTeamImage,
} from "../controllers/uploadController.js";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { getGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } from "../controllers/galleryController.js";
import { getPrograms, createProgram, updateProgram, deleteProgram } from "../controllers/programController.js";
import { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } from "../controllers/teamController.js";
import {
  getCertificates, createCertificate, deleteCertificate,
  getTransparencyDocuments, createTransparencyDocument, deleteTransparencyDocument
} from "../controllers/docController.js";
import {
  getVolunteers, createVolunteer, updateVolunteerStatus, deleteVolunteer, addVolunteerNote,
  getPartnerships, createPartnership, updatePartnershipStatus, deletePartnership, addPartnershipNote,
  getContactMessages, createContactMessage, deleteContactMessage, updateContactMessageStatus,
  getDonations, createDonation
} from "../controllers/formController.js";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from "../controllers/notificationController.js";
import {
  createCheckoutSession,
  handleWebhook,
  downloadReceipt,
  refundDonation,
  getPaymentTimeline,
  getPaymentStatus,
  getPaymentEvents
} from "../controllers/paymentController.js";

// Import Security Middleware (Rate Limiters & Validators)
import { authLimiter, publicFormLimiter, generalLimiter } from "../middleware/rateLimiters.js";
import {
  validateBody,
  loginSchema,
  volunteerSchema,
  donationSchema,
  partnershipSchema,
  contactSchema
} from "../middleware/validation.js";

const router = express.Router();

// Apply general rate limit to all read/write endpoints
router.use(generalLimiter);

// Auth routes
router.post("/auth/login", authLimiter, validateBody(loginSchema), loginAdmin);
router.get("/auth/verify", protectAdmin, verifyAdminToken);

// Upload routes (Multer + Cloudinary)
router.post("/upload", upload.single("file"), uploadFile); // Public for forms submissions
router.post("/events/upload", protectAdmin, upload.single("file"), uploadEventImage);
router.post("/gallery/upload", protectAdmin, upload.single("file"), uploadGalleryImage);
router.post("/programs/upload", protectAdmin, upload.single("file"), uploadProgramImage);
router.post("/team/upload", protectAdmin, upload.single("file"), uploadTeamImage);

// Events routes
router.get("/events", getEvents);
router.post("/events", protectAdmin, createEvent);
router.put("/events/:id", protectAdmin, updateEvent);
router.delete("/events/:id", protectAdmin, deleteEvent);

// Gallery routes
router.get("/gallery", getGallery);
router.post("/gallery", protectAdmin, createGalleryItem);
router.put("/gallery/:id", protectAdmin, updateGalleryItem);
router.delete("/gallery/:id", protectAdmin, deleteGalleryItem);

// Programs routes
router.get("/programs", getPrograms);
router.post("/programs", protectAdmin, createProgram);
router.put("/programs/:id", protectAdmin, updateProgram);
router.delete("/programs/:id", protectAdmin, deleteProgram);

// Team routes
router.get("/team", getTeam);
router.post("/team", protectAdmin, createTeamMember);
router.put("/team/:id", protectAdmin, updateTeamMember);
router.delete("/team/:id", protectAdmin, deleteTeamMember);

// Certificates & Transparency routes
router.get("/certificates", getCertificates);
router.post("/certificates", protectAdmin, createCertificate);
router.delete("/certificates/:id", protectAdmin, deleteCertificate);

router.get("/transparency", getTransparencyDocuments);
router.post("/transparency", protectAdmin, createTransparencyDocument);
router.delete("/transparency/:id", protectAdmin, deleteTransparencyDocument);

// Form routes with spam protection & schema validation
router.get("/volunteers", protectAdmin, getVolunteers);
router.post("/volunteers", publicFormLimiter, validateBody(volunteerSchema), createVolunteer);
router.put("/volunteers/:id/status", protectAdmin, updateVolunteerStatus);
router.post("/volunteers/:id/notes", protectAdmin, addVolunteerNote);
router.delete("/volunteers/:id", protectAdmin, deleteVolunteer);

router.get("/partnerships", protectAdmin, getPartnerships);
router.post("/partnerships", publicFormLimiter, validateBody(partnershipSchema), createPartnership);
router.put("/partnerships/:id/status", protectAdmin, updatePartnershipStatus);
router.post("/partnerships/:id/notes", protectAdmin, addPartnershipNote);
router.delete("/partnerships/:id", protectAdmin, deletePartnership);

// Contact routes
router.get("/contact", protectAdmin, getContactMessages);
router.post("/contact", publicFormLimiter, validateBody(contactSchema), createContactMessage);
router.put("/contact/:id/status", protectAdmin, updateContactMessageStatus);
router.delete("/contact/:id", protectAdmin, deleteContactMessage);

// Donation routes
router.get("/donations", protectAdmin, getDonations);
router.post("/donations", publicFormLimiter, validateBody(donationSchema), createDonation);

// Payment Gateway routes
router.post("/payments/create-session", publicFormLimiter, createCheckoutSession);
router.post("/payments/webhook", handleWebhook);
router.get("/payments/receipt/:id", downloadReceipt);
router.get("/payments/status/:idempotencyKey", getPaymentStatus);
router.post("/payments/refund/:id", protectAdmin, refundDonation);
router.get("/payments/timeline/:id", protectAdmin, getPaymentTimeline);
router.get("/payments", protectAdmin, getPaymentEvents);

// Settings routes
router.get("/settings", getSettings);
router.put("/settings", protectAdmin, updateSettings);

// Notifications routes
router.get("/notifications", protectAdmin, getNotifications);
router.put("/notifications/read-all", protectAdmin, markAllNotificationsRead);
router.put("/notifications/:id/read", protectAdmin, markNotificationRead);
router.delete("/notifications/:id", protectAdmin, deleteNotification);

export default router;
