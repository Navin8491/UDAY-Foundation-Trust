import { supabase } from "./supabaseClient";
import { apiRequest } from "./apiClient";
import { getAuthHeader } from "./auth";

// Interfaces matching original implementation
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
  img: string;
  images: string[] | { img: string; category: string; caption: { en: string; gu: string; hi: string } }[];
  highlights?: { en: string[]; gu: string[]; hi: string[] };
  status: "published" | "draft";
  featured?: boolean;
  show_in_featured_initiative?: boolean;
  showInFeaturedInitiative?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramItem {
  id?: string;
  _id?: string;
  keyId: string;
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
  name: { en: string; gu: string; hi: string } | string;
  role: { en: string; gu: string; hi: string };
  bio: { en: string; gu: string; hi: string };
  email: string;
  phone?: string;
  img: string;
  socials: { linkedin?: string; instagram?: string; fb?: string; tw?: string; in?: string; ln?: string };
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

  // Extended fields in database columns
  dob?: string;
  gender?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  occupation?: string;
  skills?: string;
  languages?: string;
  experience?: string;
  availability?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  resumeUrl?: string;
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

const mapItem = (item: any) => {
  if (!item) return item;
  const mapped = { ...item };
  if (item.id) {
    mapped._id = item.id;
  }
  if (item.created_at) {
    mapped.createdAt = item.created_at;
  }
  if (item.updated_at) {
    mapped.updatedAt = item.updated_at;
  }
  if (item.show_in_featured_initiative !== undefined) {
    mapped.showInFeaturedInitiative = item.show_in_featured_initiative;
  }
  return mapped;
};

// -------------------------------------------------------------
// File Upload Helper (Express Backend + Cloudinary)
// -------------------------------------------------------------
export async function uploadFile(
  file: File,
  folderPath: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const cleanFolder = folderPath.replace(/^\/+|\/+$/g, "");
  
  let endpoint = "/upload";
  if (["events", "gallery", "programs", "team"].includes(cleanFolder)) {
    endpoint = `/${cleanFolder}/upload`;
  }

  const apiHost = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const uploadUrl = `${apiHost}${endpoint}`;

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl);

    const authHeaders = getAuthHeader();
    if (authHeaders.Authorization) {
      xhr.setRequestHeader("Authorization", authHeaders.Authorization);
    }

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url);
        } catch (e) {
          reject(new Error("Failed to parse upload response."));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText || "{}");
          reject(new Error(errData.error?.message || errData.message || "Upload failed."));
        } catch (e) {
          reject(new Error(`Upload failed with status code ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error occurred during upload."));
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", cleanFolder);
    if (cleanFolder === "gallery") {
      formData.append("category", "Education");
    }

    xhr.send(formData);
  });
}

// -------------------------------------------------------------
// CRUD Operations via Express Backend API
// -------------------------------------------------------------

// -------------------------------------------------------------
// Client-Side Cache Layer for public read endpoints
// -------------------------------------------------------------
const apiCache = new Map<string, { data: any; expiry: number }>();
const CACHE_DURATION = 15000; // Cache read data for 15 seconds

async function getCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const cached = apiCache.get(key);
  if (cached && cached.expiry > now) {
    return cached.data;
  }
  const data = await fetcher();
  apiCache.set(key, { data, expiry: Date.now() + CACHE_DURATION });
  return data;
}

export function invalidateCache(key: string) {
  apiCache.delete(key);
}

// Events CRUD
export async function fetchEvents(): Promise<EventItem[]> {
  return getCached("events", async () => {
    const res = await apiRequest("/events");
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    return data.map(mapItem);
  });
}

export async function addEvent(data: any): Promise<string> {
  invalidateCache("events");
  const res = await apiRequest("/events", {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create event");
  }
  const created = await res.json();
  return created.id || created._id;
}

export async function updateEvent(id: string, data: any): Promise<void> {
  invalidateCache("events");
  const res = await apiRequest(`/events/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update event");
  }
}

export async function deleteEvent(id: string): Promise<void> {
  invalidateCache("events");
  const res = await apiRequest(`/events/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete event");
  }
}

// Programs CRUD
export async function fetchPrograms(): Promise<ProgramItem[]> {
  return getCached("programs", async () => {
    const res = await apiRequest("/programs");
    if (!res.ok) throw new Error("Failed to fetch programs");
    const data = await res.json();
    return data.map(mapItem);
  });
}

export async function addProgram(data: any): Promise<string> {
  invalidateCache("programs");
  const res = await apiRequest("/programs", {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create program");
  }
  const created = await res.json();
  return created.id || created._id;
}

export async function updateProgram(id: string, data: any): Promise<void> {
  invalidateCache("programs");
  const res = await apiRequest(`/programs/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update program");
  }
}

export async function deleteProgram(id: string): Promise<void> {
  invalidateCache("programs");
  const res = await apiRequest(`/programs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete program");
  }
}

// Gallery CRUD
export async function fetchGallery(): Promise<GalleryItem[]> {
  return getCached("gallery", async () => {
    const res = await apiRequest("/gallery");
    if (!res.ok) throw new Error("Failed to fetch gallery");
    const data = await res.json();
    return data.map(mapItem);
  });
}

export async function addGalleryItem(data: any): Promise<string> {
  invalidateCache("gallery");
  const res = await apiRequest("/gallery", {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create gallery item");
  }
  const created = await res.json();
  return created.id || created._id;
}

export async function updateGalleryItem(id: string, data: any): Promise<void> {
  invalidateCache("gallery");
  const res = await apiRequest(`/gallery/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update gallery item");
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  invalidateCache("gallery");
  const res = await apiRequest(`/gallery/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete gallery item");
  }
}

// Team CRUD
export async function fetchTeam(): Promise<TeamMember[]> {
  return getCached("team", async () => {
    const res = await apiRequest("/team");
    if (!res.ok) throw new Error("Failed to fetch team");
    const data = await res.json();
    return data.map(mapItem);
  });
}

export async function addTeamMember(data: any): Promise<string> {
  invalidateCache("team");
  const res = await apiRequest("/team", {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create team member");
  }
  const created = await res.json();
  return created.id || created._id;
}

export async function updateTeamMember(id: string, data: any): Promise<void> {
  invalidateCache("team");
  const res = await apiRequest(`/team/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update team member");
  }
}

export async function deleteTeamMember(id: string): Promise<void> {
  invalidateCache("team");
  const res = await apiRequest(`/team/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete team member");
  }
}

// Certificates CRUD
export async function fetchCertificates(): Promise<any[]> {
  return getCached("certificates", async () => {
    const res = await apiRequest("/certificates");
    if (!res.ok) throw new Error("Failed to fetch certificates");
    const data = await res.json();
    return data.map(mapItem);
  });
}

export async function addCertificate(data: any): Promise<string> {
  invalidateCache("certificates");
  invalidateCache("docs");
  const res = await apiRequest("/certificates", {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create certificate");
  }
  const created = await res.json();
  return created.id || created._id;
}

export async function deleteCertificate(id: string): Promise<void> {
  invalidateCache("certificates");
  invalidateCache("docs");
  const res = await apiRequest(`/certificates/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete certificate");
  }
}

// Transparency Document CRUD
export async function fetchTransparencyDocs(): Promise<TransparencyDoc[]> {
  return getCached("docs", async () => {
    const res = await apiRequest("/transparency");
    if (!res.ok) throw new Error("Failed to fetch transparency documents");
    const data = await res.json();
    return data.map(mapItem);
  });
}

export async function addTransparencyDocument(data: any): Promise<string> {
  invalidateCache("docs");
  const res = await apiRequest("/transparency", {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create document");
  }
  const created = await res.json();
  return created.id || created._id;
}

export async function deleteTransparencyDocument(id: string): Promise<void> {
  invalidateCache("docs");
  const res = await apiRequest(`/transparency/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete document");
  }
}

// Public Ingestion endpoints
export async function submitContactMessage(data: any): Promise<string> {
  const res = await apiRequest("/contact", {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit message");
  }
  const created = await res.json();
  return created.id || created._id;
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await apiRequest("/contact");
  if (!res.ok) throw new Error("Failed to fetch messages");
  const data = await res.json();
  return data.map(mapItem);
}

export async function deleteContactMessage(id: string): Promise<void> {
  const res = await apiRequest(`/contact/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete message");
  }
}

export async function updateContactMessageStatus(id: string, status: "unread" | "read"): Promise<void> {
  const res = await apiRequest(`/contact/${id}/status`, {
    method: "PUT",
    body: { status },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update contact message status");
  }
}

export async function submitVolunteerApplication(data: any): Promise<string> {
  const res = await apiRequest("/volunteers", {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit application");
  }
  const created = await res.json();
  return created.id || created._id;
}

export async function fetchVolunteerApplications(): Promise<VolunteerApplication[]> {
  const res = await apiRequest("/volunteers");
  if (!res.ok) throw new Error("Failed to fetch volunteers");
  const data = await res.json();
  return data.map(mapItem);
}

export async function deleteVolunteer(id: string): Promise<void> {
  const res = await apiRequest(`/volunteers/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete volunteer record");
  }
}

export async function updateVolunteerStatus(
  id: string,
  status: "pending" | "approved" | "rejected",
  reason?: string
): Promise<void> {
  const res = await apiRequest(`/volunteers/${id}/status`, {
    method: "PUT",
    body: { status, reason },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update volunteer status");
  }
}

export async function addVolunteerNote(id: string, text: string): Promise<void> {
  const res = await apiRequest(`/volunteers/${id}/notes`, {
    method: "POST",
    body: { text },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to add volunteer note");
  }
}

export async function submitPartnershipRequest(data: any): Promise<string> {
  const res = await apiRequest("/partnerships", {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit partnership request");
  }
  const created = await res.json();
  return created.id || created._id;
}

export async function fetchPartnershipRequests(): Promise<PartnershipRequest[]> {
  const res = await apiRequest("/partnerships");
  if (!res.ok) throw new Error("Failed to fetch partnerships");
  const data = await res.json();
  return data.map(mapItem);
}
export { fetchPartnershipRequests as fetchPartnerships, fetchVolunteerApplications as fetchVolunteers };

export async function updatePartnershipStatus(
  id: string,
  status: "pending" | "approved" | "rejected",
  reason?: string
): Promise<void> {
  const res = await apiRequest(`/partnerships/${id}/status`, {
    method: "PUT",
    body: { status, reason },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update partnership status");
  }
}

export async function addPartnershipNote(id: string, text: string): Promise<void> {
  const res = await apiRequest(`/partnerships/${id}/notes`, {
    method: "POST",
    body: { text },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to add partnership note");
  }
}

export async function deletePartnership(id: string): Promise<void> {
  const res = await apiRequest(`/partnerships/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete partnership record");
  }
}

export async function fetchDonations(): Promise<any[]> {
  const res = await apiRequest("/donations");
  if (!res.ok) throw new Error("Failed to fetch donations");
  const data = await res.json();
  return data.map(mapItem);
}

export async function submitDonation(data: any): Promise<string> {
  const res = await apiRequest("/donations", {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit donation");
  }
  const created = await res.json();
  return created.id || created._id;
}

export async function initiateDonationPayment(data: any): Promise<{ sessionId: string; url: string; idempotencyKey: string; eventId: string; status?: string }> {
  const res = await apiRequest("/payments/create-session", {
    method: "POST",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to initiate payment session");
  }
  return res.json();
}

export async function fetchPaymentStatus(idempotencyKey: string): Promise<any> {
  const res = await apiRequest(`/payments/status/${idempotencyKey}`);
  if (!res.ok) throw new Error("Failed to fetch payment status");
  return res.json();
}



export async function fetchSettings(): Promise<any> {
  return getCached("settings", async () => {
    const res = await apiRequest("/settings");
    if (!res.ok) throw new Error("Failed to fetch settings");
    const data = await res.json();
    return mapItem(data);
  });
}

export async function updateSettings(settings: any): Promise<void> {
  invalidateCache("settings");
  const res = await apiRequest("/settings", {
    method: "PUT",
    body: settings,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to save settings");
  }
}

// -------------------------------------------------------------
// Real-time synchronization listeners using Supabase Channels
// -------------------------------------------------------------

export function subscribeEvents(callback: (items: EventItem[]) => void, onError?: (err: any) => void) {
  fetchEvents()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const channel = supabase
    .channel("public-events-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "events" },
      () => {
        invalidateCache("events");
        fetchEvents().then(callback).catch(onError);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribePrograms(callback: (items: ProgramItem[]) => void, onError?: (err: any) => void) {
  fetchPrograms()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const channel = supabase
    .channel("public-programs-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "programs" },
      () => {
        invalidateCache("programs");
        fetchPrograms().then(callback).catch(onError);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeGallery(callback: (items: GalleryItem[]) => void, onError?: (err: any) => void) {
  fetchGallery()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const channel = supabase
    .channel("public-gallery-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "gallery" },
      () => {
        invalidateCache("gallery");
        fetchGallery().then(callback).catch(onError);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeTeam(callback: (items: TeamMember[]) => void, onError?: (err: any) => void) {
  fetchTeam()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const channel = supabase
    .channel("public-team-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "team" },
      () => {
        invalidateCache("team");
        fetchTeam().then(callback).catch(onError);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeTransparencyDocs(callback: (items: TransparencyDoc[]) => void, onError?: (err: any) => void) {
  fetchTransparencyDocs()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const channelCert = supabase
    .channel("public-certificates-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "certificates" },
      () => {
        invalidateCache("certificates");
        invalidateCache("docs");
        fetchTransparencyDocs().then(callback).catch(onError);
      }
    )
    .subscribe();

  const channelDoc = supabase
    .channel("public-transparency-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "transparency_documents" },
      () => {
        invalidateCache("docs");
        fetchTransparencyDocs().then(callback).catch(onError);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channelCert);
    supabase.removeChannel(channelDoc);
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

  const channel = supabase
    .channel("public-settings-changes-" + Math.random().toString(36).slice(2))
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "settings" },
      () => {
        invalidateCache("settings");
        fetchSettings()
          .then((data) => {
            if (data) callback(data);
          })
          .catch(onError);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeDonations(callback: (items: any[]) => void, onError?: (err: any) => void) {
  fetchDonations()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const channel = supabase
    .channel("public-donations-changes-" + Math.random().toString(36).slice(2))
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "donations" },
      () => {
        fetchDonations().then(callback).catch(onError);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export interface NotificationItem {
  id: string;
  type: "volunteer" | "partnership" | "donation" | "contact" | "event" | "program";
  title: string;
  message: string;
  related_record_id?: string;
  read_status: boolean;
  created_at: string;
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const res = await apiRequest("/notifications");
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function markNotificationRead(id: string): Promise<NotificationItem> {
  const res = await apiRequest(`/notifications/${id}/read`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to mark notification as read");
  return res.json();
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await apiRequest("/notifications/read-all", {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to mark all notifications as read");
}

export async function deleteNotification(id: string): Promise<void> {
  const res = await apiRequest(`/notifications/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete notification");
}

export function subscribeNotifications(callback: (items: NotificationItem[]) => void, onError?: (err: any) => void) {
  fetchNotifications()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const channel = supabase
    .channel("public-notifications-changes-" + Math.random().toString(36).slice(2))
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications" },
      () => {
        fetchNotifications().then(callback).catch(onError);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function fetchPaymentEvents(): Promise<any[]> {
  const res = await apiRequest("/payments");
  if (!res.ok) throw new Error("Failed to fetch payment events");
  return res.json();
}

export async function refundPaymentEvent(id: string): Promise<any> {
  const res = await apiRequest(`/payments/refund/${id}`, {
    method: "POST"
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to refund payment");
  }
  return res.json();
}

export function subscribePaymentEvents(callback: (items: any[]) => void, onError?: (err: any) => void) {
  fetchPaymentEvents()
    .then(callback)
    .catch((err) => {
      if (onError) onError(err);
    });

  const channel = supabase
    .channel("public-payment-events-changes-" + Math.random().toString(36).slice(2))
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "payment_events" },
      () => {
        fetchPaymentEvents().then(callback).catch(onError);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
