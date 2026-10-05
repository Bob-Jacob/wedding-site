import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development the API runs on :8000, so proxy /api and /media to it.
// That way the frontend can call "/api/..." with no CORS fuss.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8000",
      "/media": "http://127.0.0.1:8000",
    },
  },
});
