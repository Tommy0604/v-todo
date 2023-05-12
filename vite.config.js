import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: true,
    port: 3000
  },
  build: {
    sourcemap: true,
    outDir: "docs",
  },
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ["lottie-player"].includes(tag),
        },
      },
    }),
  ],
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
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false, // off Option api to avoid i18n console warnings
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
});
