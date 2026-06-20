// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  //   build: {
  //     // 'hidden' uploads maps to services but doesn't expose them publicly
  //     sourcemap: "hidden",
  //   },

  server: {
    // cors: true,
    // OR allow specific origins (recommended)
    cors: {
      origin: "http://localhost:5173",
      // or use a regex for multiple domains
      // origin: /https?:\/\/localhost(:\d+)?$/
    },

    proxy: {
      "/api": {
        target: "https://s3.kopah.uw.edu/liveocean-web/", // Your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
