import { apiRequest } from "./apiClient";

let authState: any = null;
const listeners = new Set<(user: any | null) => void>();

// Read initial session state from localStorage or sessionStorage
const token = localStorage.getItem("admin_token") || sessionStorage.getItem("admin_token");
const email = localStorage.getItem("admin_email") || sessionStorage.getItem("admin_email");
if (token && email) {
  authState = { email };
}

export function onAuthStateChanged(callback: (user: any | null) => void) {
  listeners.add(callback);
  // Trigger immediately with current state
  callback(authState);
  
  // Return unsubscribe function
  return () => {
    listeners.delete(callback);
  };
}

function notifyListeners() {
  listeners.forEach((cb) => cb(authState));
}

// Retrieve authorization header helper
export function getAuthHeader(): Record<string, string> {
  const activeToken = localStorage.getItem("admin_token") || sessionStorage.getItem("admin_token");
  return activeToken ? { Authorization: `Bearer ${activeToken}` } : {};
}

export async function signInAdmin(emailAddress: string, pass: string, remember: boolean): Promise<any> {
  const cleanEmail = emailAddress.trim();

  const res = await apiRequest("/auth/login", {
    method: "POST",
    body: { email: cleanEmail, password: pass },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Invalid email or password.");
  }

  const data = await res.json();
  
  // Store session tokens
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("admin_token", data.token);
  storage.setItem("admin_email", data.email);

  authState = { email: data.email };
  notifyListeners();

  return authState;
}

export async function signOutAdmin(): Promise<void> {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_email");
  sessionStorage.removeItem("admin_token");
  sessionStorage.removeItem("admin_email");

  authState = null;
  notifyListeners();
}

export function subscribeToAuthState(callback: (user: any | null) => void): () => void {
  return onAuthStateChanged(callback);
}
