import { getAuthHeader } from "./auth";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket: any = null;
function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
}

// Interfaces matching PRD
export interface EventItem {
  id?: string;
  _id?: string;
  title: { en: string; gu: string; hi: string };
  slug: string;
  category: string;
  place: { en: string; gu: string; hi: string };
  date: string;
  summary: { en: string; gu: string; hi: string };
  participants: number;
  volunteers: number;
  impact: { en: string; gu: string; hi: string };
  img: string; // Featured image URL
  images: { img: string; category: string; caption: { en: string; gu: string; hi: string } }[];
  highlights?: { en: string[]; gu: string[]; hi: string[] };
  status: "published" | "draft";
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramItem {
  id?: string;
  _id?: string;
  keyId: string; // e.g. "education", "child"
  title: { en: string; gu: string; hi: string };
  desc: { en: string; gu: string; hi: string };
  objectives: { en: string; gu: string; hi: string }[];
  activities: { en: string; gu: string; hi: string }[];
  impactVal: { en: string; gu: string; hi: string };
  successTitle?: { en: string; gu: string; hi: string };
  successStory?: { en: string; gu: string; hi: string };
  successQuote?: { en: string; gu: string; hi: string };
  image: string;
  thumbnails: string[];
  color?: string;
  iconName?: string;
  createdAt: string;
}

export interface TeamMember {
  id?: string;
  _id?: string;
  memberId: string;
  name: { en: string; gu: string; hi: string };
  role: { en: string; gu: string; hi: string };
  bio: { en: string; gu: string; hi: string };
  email: string;
  phone?: string;
  img: string;
  socials: { linkedin?: string; instagram?: string };
  displayOrder: number;
}

export interface GalleryItem {
  id?: string;
  _id?: string;
  img: string;
  cat: string;
  h: "tall" | "short";
  uploadedAt: string;
}

export interface DonationRecord {
  id?: string;
  _id?: string;
  donorName: string;
  email: string;
  phone: string;
  address: string;
  panNumber: string;
  amount: number;
  purpose: string;
  receiptNumber: string;
  createdAt: string;
}

export interface VolunteerApplication {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  photoUrl: string;
  idProofUrl: string;
  message?: string;
  role?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface PartnershipRequest {
  id?: string;
  _id?: string;
  organization: string;
  contactPerson: string;
  email: string;
  phone: string;
  message: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface ContactMessage {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read";
  createdAt: string;
}

export interface TransparencyDoc {
  id?: string;
  _id?: string;
  label: string;
  value: string;
  desc: string;
  file: string;
  category: "registration" | "certificate" | "report";
  uploadedAt: string;
}

// Helper to map Mongoose _id to id
const mapItem = (item: any) => {
  if (item && item._id) {
    return { ...item, id: item._id };
  }
  return item;
};

// -------------------------------------------------------------
// File Upload Helper (Multer + Cloudinary via backend)
// -------------------------------------------------------------
export async function uploadFile(
  file: File,
  folderPath: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/upload`);

    // Add authorization token
    const authHeaders = getAuthHeader();
    if (authHeaders.Authorization) {
      xhr.setRequestHeader("Authorization", authHeaders.Authorization);
    }

    // Track upload progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.url);
        } catch (e) {
          reject(new Error("Failed to parse upload response."));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText || "{}");
          reject(new Error(errData.message || "Failed to upload file."));
        } catch (e) {
          reject(new Error(`Upload failed with status code ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network upload error occurred. Ensure backend is running."));
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folderPath);
    xhr.send(formData);
  });
}

// -------------------------------------------------------------
// Public Data Loading Routines
// -------------------------------------------------------------
export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    return data.map(mapItem);
  } catch (err: any) {
    console.error("fetchEvents failed:", err);
    return [];
  }
}

export async function fetchPrograms(): Promise<ProgramItem[]> {
  try {
    const res = await fetch(`${API_URL}/programs`);
    if (!res.ok) throw new Error("Failed to fetch programs");
    const data = await res.json();
    return data.map(mapItem);
  } catch (err: any) {
    console.error("fetchPrograms failed:", err);
    return [];
  }
}

export async function fetchTeam(): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${API_URL}/team`);
    if (!res.ok) throw new Error("Failed to fetch team members");
    const data = await res.json();
    return data.map(mapItem);
  } catch (err: any) {
    console.error("fetchTeam failed:", err);
    return [];
  }
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const res = await fetch(`${API_URL}/gallery`);
    if (!res.ok) throw new Error("Failed to fetch gallery");
    const data = await res.json();
    return data.map(mapItem);
  } catch (err: any) {
    console.error("fetchGallery failed:", err);
    return [];
  }
}

export async function fetchCertificates(): Promise<TransparencyDoc[]> {
  try {
    const res = await fetch(`${API_URL}/certificates`);
    if (!res.ok) throw new Error("Failed to fetch certificates");
    const data = await res.json();
    return data.map(mapItem);
  } catch (err: any) {
    console.error("fetchCertificates failed:", err);
    return [];
  }
}

export async function fetchTransparencyDocuments(): Promise<TransparencyDoc[]> {
  try {
    const res = await fetch(`${API_URL}/transparency`);
    if (!res.ok) throw new Error("Failed to fetch transparency documents");
    const data = await res.json();
    return data.map(mapItem);
  } catch (err: any) {
    console.error("fetchTransparencyDocuments failed:", err);
    return [];
  }
}

export async function fetchTransparencyDocs(): Promise<TransparencyDoc[]> {
  try {
    const [certs, docs] = await Promise.all([
      fetchCertificates(),
      fetchTransparencyDocuments()
    ]);
    return [...certs, ...docs];
  } catch (err: any) {
    console.error("fetchTransparencyDocs failed:", err);
    return [];
  }
}

export async function fetchSettings(): Promise<any> {
  try {
    const res = await fetch(`${API_URL}/settings`);
    if (!res.ok) throw new Error("Failed to fetch settings");
    return mapItem(await res.json());
  } catch (err: any) {
    console.error("fetchSettings failed:", err);
    return null;
  }
}

// -------------------------------------------------------------
// Administrator Panel Mutation Handlers
// -------------------------------------------------------------

// Events CRUD
export async function addEvent(data: any): Promise<string> {
  const res = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create event");
  }
  const created = await res.json();
  return created._id;
}

export async function updateEvent(id: string, data: any): Promise<void> {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update event");
  }
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete event");
  }
}

// Programs CRUD
export async function addProgram(data: any): Promise<string> {
  const res = await fetch(`${API_URL}/programs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create program");
  }
  const created = await res.json();
  return created._id;
}

export async function updateProgram(id: string, data: any): Promise<void> {
  const res = await fetch(`${API_URL}/programs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update program");
  }
}

export async function deleteProgram(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/programs/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete program");
  }
}

// Gallery CRUD
export async function addGalleryItem(data: any): Promise<string> {
  const res = await fetch(`${API_URL}/gallery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create gallery item");
  }
  const created = await res.json();
  return created._id;
}

export async function updateGalleryItem(id: string, data: any): Promise<void> {
  const res = await fetch(`${API_URL}/gallery/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update gallery item");
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/gallery/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete gallery item");
  }
}

// Team CRUD
export async function addTeamMember(data: any): Promise<string> {
  const res = await fetch(`${API_URL}/team`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create team member");
  }
  const created = await res.json();
  return created._id;
}

export async function updateTeamMember(id: string, data: any): Promise<void> {
  const res = await fetch(`${API_URL}/team/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update team member");
  }
}

export async function deleteTeamMember(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/team/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete team member");
  }
}

// Certificates CRUD
export async function addCertificate(data: any): Promise<string> {
  const res = await fetch(`${API_URL}/certificates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create certificate");
  }
  const created = await res.json();
  return created._id;
}

export async function deleteCertificate(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/certificates/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete certificate");
  }
}

// Transparency Document CRUD
export async function addTransparencyDocument(data: any): Promise<string> {
  const res = await fetch(`${API_URL}/transparency`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create document");
  }
  const created = await res.json();
  return created._id;
}

export async function deleteTransparencyDocument(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/transparency/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete document");
  }
}

// Public Ingestion endpoints
export async function submitContactMessage(data: any): Promise<string> {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit message");
  }
  const created = await res.json();
  return created._id;
}

export async function submitVolunteerApplication(data: any): Promise<string> {
  const res = await fetch(`${API_URL}/volunteers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit application");
  }
  const created = await res.json();
  return created._id;
}

export async function submitPartnershipRequest(data: any): Promise<string> {
  const res = await fetch(`${API_URL}/partnerships`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit partnership request");
  }
  const created = await res.json();
  return created._id;
}

export async function submitDonationRecord(data: any): Promise<string> {
  const res = await fetch(`${API_URL}/donations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to record donation");
  }
  const created = await res.json();
  return created._id;
}

export { submitDonationRecord as submitDonation };

// Dashboard Fetchers
export async function fetchContactMessages(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/contact`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error("Failed to fetch messages");
    const data = await res.json();
    return data.map(mapItem);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function updateContactMessageStatus(id: string, status: "read" | "unread"): Promise<void> {
  const res = await fetch(`${API_URL}/contact/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update contact message status");
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/contact/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete contact message");
  }
}

export async function fetchVolunteers(): Promise<VolunteerApplication[]> {
  try {
    const res = await fetch(`${API_URL}/volunteers`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error("Failed to fetch volunteers");
    const data = await res.json();
    return data.map(mapItem) as VolunteerApplication[];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function updateVolunteerStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<void> {
  const res = await fetch(`${API_URL}/volunteers/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update volunteer status");
  }
}

export async function deleteVolunteer(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/volunteers/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete volunteer record");
  }
}

export async function fetchPartnershipRequests(): Promise<PartnershipRequest[]> {
  try {
    const res = await fetch(`${API_URL}/partnerships`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error("Failed to fetch partnerships");
    const data = await res.json();
    return data.map(mapItem) as PartnershipRequest[];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export { fetchPartnershipRequests as fetchPartnerships };

export async function updatePartnershipStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<void> {
  const res = await fetch(`${API_URL}/partnerships/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update partnership status");
  }
}

export async function deletePartnership(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/partnerships/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete partnership record");
  }
}

export async function fetchDonations(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/donations`, { headers: getAuthHeader() });
    if (!res.ok) throw new Error("Failed to fetch donations");
    const data = await res.json();
    return data.map(mapItem);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function updateSettings(settings: any): Promise<void> {
  const res = await fetch(`${API_URL}/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(settings),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to save settings");
  }
}

// -------------------------------------------------------------
// Real-time synchronization listeners using Socket.io
// -------------------------------------------------------------

export function subscribeEvents(callback: (items: EventItem[]) => void, onError?: (err: any) => void) {
  fetchEvents()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const socketConn = getSocket();
  const handleUpdate = () => {
    fetchEvents()
      .then(callback)
      .catch((err) => {
        if (onError) onError(err);
      });
  };

  socketConn.on("events_changed", handleUpdate);
  return () => {
    socketConn.off("events_changed", handleUpdate);
  };
}

export function subscribePrograms(callback: (items: ProgramItem[]) => void, onError?: (err: any) => void) {
  fetchPrograms()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const socketConn = getSocket();
  const handleUpdate = () => {
    fetchPrograms()
      .then(callback)
      .catch((err) => {
        if (onError) onError(err);
      });
  };

  socketConn.on("programs_changed", handleUpdate);
  return () => {
    socketConn.off("programs_changed", handleUpdate);
  };
}

export function subscribeGallery(callback: (items: GalleryItem[]) => void, onError?: (err: any) => void) {
  fetchGallery()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const socketConn = getSocket();
  const handleUpdate = () => {
    fetchGallery()
      .then(callback)
      .catch((err) => {
        if (onError) onError(err);
      });
  };

  socketConn.on("gallery_changed", handleUpdate);
  return () => {
    socketConn.off("gallery_changed", handleUpdate);
  };
}

export function subscribeTeam(callback: (items: TeamMember[]) => void, onError?: (err: any) => void) {
  fetchTeam()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const socketConn = getSocket();
  const handleUpdate = () => {
    fetchTeam()
      .then(callback)
      .catch((err) => {
        if (onError) onError(err);
      });
  };

  socketConn.on("team_changed", handleUpdate);
  return () => {
    socketConn.off("team_changed", handleUpdate);
  };
}

export function subscribeTransparencyDocs(callback: (items: TransparencyDoc[]) => void, onError?: (err: any) => void) {
  fetchTransparencyDocs()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const socketConn = getSocket();
  const handleUpdate = () => {
    fetchTransparencyDocs()
      .then(callback)
      .catch((err) => {
        if (onError) onError(err);
      });
  };

  socketConn.on("certificates_changed", handleUpdate);
  socketConn.on("transparency_documents_changed", handleUpdate);

  return () => {
    socketConn.off("certificates_changed", handleUpdate);
    socketConn.off("transparency_documents_changed", handleUpdate);
  };
}

export function subscribeSettings(callback: (settings: any) => void, onError?: (err: any) => void) {
  fetchSettings()
    .then((data) => {
      if (data) callback(data);
    })
    .catch((err) => {
      if (onError) onError(err);
    });

  const socketConn = getSocket();
  const handleUpdate = () => {
    fetchSettings()
      .then((data) => {
        if (data) callback(data);
      })
      .catch((err) => {
        if (onError) onError(err);
      });
  };

  socketConn.on("settings_changed", handleUpdate);
  return () => {
    socketConn.off("settings_changed", handleUpdate);
  };
}
