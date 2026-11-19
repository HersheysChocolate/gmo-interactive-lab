import { defineConfig } from "vite";

// Relative asset paths let the same build work under a GitHub Pages repo URL.
export default defineConfig({
  base: "./"
});
