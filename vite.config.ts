import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  cloudflare: false,
  vite: {
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
