const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: isForm ? {} : { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    let detail = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      if (typeof data.detail === "string") detail = data.detail;
    } catch {
      /* keep the default message */
    }
    throw new Error(detail);
  }
  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  upload: (path, formData) => request(path, { method: "POST", body: formData }),
};

// Photos saved locally come back as "/media/..." and need the API origin in front.
export const assetUrl = (url) => (url && url.startsWith("/") ? `${BASE}${url}` : url);
