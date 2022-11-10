import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: true,
  },
  build: {
    sourcemap: true,
    outDir: 'docs',
  },
  base: "./",
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
      },
      less: {
        modifyVars: {
          "primary-color": "#42B883",
        },
        javascriptEnabled: true,
      },
    },
  },
});
