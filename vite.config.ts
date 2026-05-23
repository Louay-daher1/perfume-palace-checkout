import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
    hmr: {
      overlay: false,
      clientPort: 8080,
    },
    // Phone only needs port 8080 — Vite forwards API/images to Laravel on this PC
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/storage": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) {
              return "motion";
            }
            if (id.includes("@tanstack/react-query") || id.includes("@tanstack/query-core")) {
              return "query";
            }
            if (
              id.includes("react-router") ||
              id.includes("react-dom") ||
              /node_modules[/\\]react[/\\]/.test(id)
            ) {
              return "vendor";
            }
          }
        },
      },
    },
  },
}));
