import { getAuthHeader } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface CustomRequestInit extends Omit<RequestInit, "body"> {
  body?: any;
}

export async function apiRequest(endpoint: string, options: CustomRequestInit = {}): Promise<Response> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const headers = new Headers(options.headers || {});
  
  // Auto-inject Auth Token
  const authHeaders = getAuthHeader();
  if (authHeaders.Authorization) {
    headers.set("Authorization", authHeaders.Authorization);
  }

  // Auto-inject JSON Content Type
  let requestBody = options.body;
  if (requestBody && !(requestBody instanceof FormData) && typeof requestBody === "object") {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(requestBody);
  }

  const config: RequestInit = {
    ...options,
    headers,
    body: requestBody,
    credentials: "include", // Ensure withCredentials equivalent for fetch
  };

  const response = await fetch(url, config);
  return response;
}
