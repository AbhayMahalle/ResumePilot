import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { vercelPreset } from "@vercel/react-router/vite";

import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter({
      presets: [vercelPreset()]
    })
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app")
    }
  }
});