import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

// Netlify sets NETLIFY=true during its builds. The VPS/Docker build is unaffected.
const onNetlify = process.env.NETLIFY === "true";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  cloudflare: false,
  vite: {
    plugins: onNetlify ? [netlify()] : [],
    server: {
      proxy: {
        "/api": {
          target: "http://165.101.215.46:5001",
          changeOrigin: true,
        },
      },
    },
    preview: {
      proxy: {
        "/api": {
          target: process.env.VITE_INTERNAL_BACKEND_URL || "http://oms-backend:5000",
          changeOrigin: true,
        },
      },
    },
  },
});
