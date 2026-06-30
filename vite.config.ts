import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) return "vendor-framer-motion";
            if (id.includes("gsap")) return "vendor-gsap";
            if (id.includes("lucide-react")) return "vendor-lucide";
            if (id.includes("@supabase")) return "vendor-supabase";
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
