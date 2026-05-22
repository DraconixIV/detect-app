import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.svg",
        "icon-192.png",
        "icon-512.png"
      ],

      manifest: {
        name: "Metal Detector App",

        short_name: "Detector",

        description:
          "Application de détection métal",

        theme_color: "#1f2937",

        background_color: "#111827",

        display: "standalone",

        orientation: "portrait",

        scope: "/",

        start_url: "/",

        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },

          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],

  server: {
    host: true
  }
});