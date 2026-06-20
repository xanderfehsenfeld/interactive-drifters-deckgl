import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
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
