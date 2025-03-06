import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/movie_recommendation_system/",  // Base path must match the subdirectory
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["python.sicsglobal.com"],
    strictPort: true,  // Ensure Vite uses the correct port
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
});
