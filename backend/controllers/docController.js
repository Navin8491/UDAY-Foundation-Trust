import Certificate from "../models/Certificate.js";
import TransparencyDocument from "../models/TransparencyDocument.js";
import { triggerUpdate } from "../utils/realtime.js";

// Certificates CRUD
export const getCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find().sort({ uploadedAt: 1 });
    res.json(certs);
  } catch (error) {
    next(error);
  }
};

export const createCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.create(req.body);
    triggerUpdate("certificates");
    res.status(201).json(cert);
  } catch (error) {
    next(error);
  }
};

export const deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) {
      res.status(404);
      return next(new Error("Certificate not found"));
    }
    triggerUpdate("certificates");
    res.json({ message: "Certificate removed successfully" });
  } catch (error) {
    next(error);
  }
};

// Transparency Documents CRUD
export const getTransparencyDocuments = async (req, res, next) => {
  try {
    const docs = await TransparencyDocument.find().sort({ uploadedAt: 1 });
    res.json(docs);
  } catch (error) {
    next(error);
  }
};

export const createTransparencyDocument = async (req, res, next) => {
  try {
    const docItem = await TransparencyDocument.create(req.body);
    triggerUpdate("transparency_documents");
    res.status(201).json(docItem);
  } catch (error) {
    next(error);
  }
};

export const deleteTransparencyDocument = async (req, res, next) => {
  try {
    const docItem = await TransparencyDocument.findByIdAndDelete(req.params.id);
    if (!docItem) {
      res.status(404);
      return next(new Error("Document not found"));
    }
    triggerUpdate("transparency_documents");
    res.json({ message: "Document removed successfully" });
  } catch (error) {
    next(error);
  }
};
