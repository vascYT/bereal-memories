// @ts-check
import { defineConfig } from "astro/config";
import { version } from "./package.json";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  integrations: [react()],
  vite: {
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
    plugins: [tailwindcss()],
  },
});
