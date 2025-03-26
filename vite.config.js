import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url"; // Import URL module for ESM support

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url)
      ),
      "@config": fileURLToPath(new URL("./src/config", import.meta.url)),
      "@data": fileURLToPath(new URL("./src/data", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@helpers": fileURLToPath(new URL("./src/helpers", import.meta.url)),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@store": fileURLToPath(new URL("./src/store", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase the limit to 1 MB
  },
});
