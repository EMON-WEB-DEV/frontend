const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("taskflow_token");
}

export function setToken(token) {
  if (token) localStorage.setItem("taskflow_token", token);
  else localStorage.removeItem("taskflow_token");
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || "Something went wrong.");
    error.code = data.code;
    error.status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: () => request("/auth/me"),

  listProjects: () => request("/projects"),
  createProject: (payload) => request("/projects", { method: "POST", body: payload }),
  getProject: (id) => request(`/projects/${id}`),
  updateProject: (id, payload) => request(`/projects/${id}`, { method: "PUT", body: payload }),
  deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE" }),

  createTask: (projectId, payload) =>
    request(`/projects/${projectId}/tasks`, { method: "POST", body: payload }),
  updateTask: (id, payload) => request(`/tasks/${id}`, { method: "PUT", body: payload }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),

  billingStatus: () => request("/billing/status"),
  createCheckoutSession: (plan) =>
    request("/billing/create-checkout-session", { method: "POST", body: { plan } }),
  createPortalSession: () => request("/billing/create-portal-session", { method: "POST" }),
};
