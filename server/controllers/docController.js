import { supabase } from "../config/db.js";
import { deleteFile } from "../services/storageService.js";
import { triggerUpdate } from "../utils/realtime.js";

// Certificates CRUD
export const getCertificates = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const createCertificate = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    triggerUpdate("certificates");
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteCertificate = async (req, res, next) => {
  try {
    const { data: cert, error: fetchError } = await supabase
      .from("certificates")
      .select("file")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !cert) {
      res.status(404);
      return next(new Error("Certificate not found"));
    }

    if (cert.file) {
      await deleteFile(cert.file).catch(err => console.error("Failed to delete certificate file from storage:", err));
    }

    const { error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    triggerUpdate("certificates");
    res.json({ message: "Certificate removed successfully" });
  } catch (error) {
    next(error);
  }
};

// Transparency Documents CRUD
export const getTransparencyDocuments = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("transparency_documents")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const createTransparencyDocument = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("transparency_documents")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    triggerUpdate("transparency_documents");
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteTransparencyDocument = async (req, res, next) => {
  try {
    const { data: docItem, error: fetchError } = await supabase
      .from("transparency_documents")
      .select("file")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !docItem) {
      res.status(404);
      return next(new Error("Document not found"));
    }

    if (docItem.file) {
      await deleteFile(docItem.file).catch(err => console.error("Failed to delete transparency document file from storage:", err));
    }

    const { error } = await supabase
      .from("transparency_documents")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    triggerUpdate("transparency_documents");
    res.json({ message: "Document removed successfully" });
  } catch (error) {
    next(error);
  }
};
