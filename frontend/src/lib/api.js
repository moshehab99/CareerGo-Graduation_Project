import { getAuthToken } from "./userStorage";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ——— Auth ———

export function registerCandidate(body) {
  return request("/candidates/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginCandidate(body) {
  return request("/candidates/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function registerCompany(body) {
  return request("/companies/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginCompany(body) {
  return request("/companies/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ——— Candidate ———

export function getCandidateProfile() {
  return request("/candidates/me");
}

export function updateCareerInterests(body) {
  return request("/candidates/career-interests", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function uploadCV(file) {
  console.log("[uploadCV] selectedFile:", file);
  const formData = new FormData();
  formData.append("cv", file);
  console.log("[uploadCV] formData:", formData);
  return request("/candidates/upload-cv", {
    method: "POST",
    body: formData,
  }).catch((err) => {
    console.error("[uploadCV] API error:", err.status, err.message, err.data);
    throw err;
  });
}

export function extractCVInfo(file) {
  const url = `${API_BASE}/candidates/extract-cv`;
  console.log("[extractCVInfo] request URL:", url);
  console.log("[extractCVInfo] selectedFile:", file);
  console.log("[extractCVInfo] file name:", file?.name, "size:", file?.size, "type:", file?.type);

  const formData = new FormData();
  formData.append("file", file);
  console.log("[extractCVInfo] formData (field: file):", formData);
  console.log("[extractCVInfo] Content-Type: set automatically by browser (multipart boundary)");

  return request("/candidates/extract-cv", {
    method: "POST",
    body: formData,
  })
    .then((data) => {
      console.log("[extractCVInfo] Node response:", data);
      return data;
    })
    .catch((err) => {
      console.error("[extractCVInfo] API error:", {
        url,
        status: err.status,
        message: err.message,
        data: err.data,
      });
      throw err;
    });
}

export function getSavedJobs() {
  return request("/candidates/saved-jobs");
}

export function toggleSaveJob(jobId) {
  return request(`/candidates/saved-jobs/${jobId}`, { method: "POST" });
}

export function removeSavedJob(jobId) {
  return request(`/candidates/saved-jobs/${jobId}`, { method: "DELETE" });
}

export function hideJobApi(jobId) {
  return request(`/candidates/hidden-jobs/${jobId}`, { method: "POST" });
}

// ——— Jobs ———

export function exploreJobs(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    )
  ).toString();
  return request(`/jobs/explore${query ? `?${query}` : ""}`);
}

export function getJobById(jobId) {
  return request(`/jobs/${jobId}`);
}

export function applyToJob(jobId) {
  return request(`/jobs/${jobId}/apply`, { method: "POST" });
}

export function getMyApplications() {
  return request("/jobs/my-applications");
}

export function createJob(body) {
  return request("/jobs", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function saveJobDraft(body) {
  return request("/jobs/draft", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateJob(jobId, body) {
  return request(`/jobs/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteJob(jobId) {
  return request(`/jobs/${jobId}`, { method: "DELETE" });
}

export function getMyJobs(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/jobs/my-posts${query ? `?${query}` : ""}`);
}

// ——— Company ———

export function getCompanyDashboard() {
  return request("/companies/dashboard");
}

export function getCompanyProfile(companyId) {
  return request(`/companies/${companyId}`);
}

export function searchCandidates(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/companies/candidates${query ? `?${query}` : ""}`);
}

// ——— AI ———

export function matchJobWithAI(jobId) {
  return request("/ai/match", {
    method: "POST",
    body: JSON.stringify({ jobId }),
  });
}
