import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import Components from "unplugin-vue-components/vite";
import {
  AntDesignVueResolver,
} from 'unplugin-vue-components/resolvers'

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
    visualizer({
      open: true,
      filename: "stats.html", //分析图生成的文件名
      gzipSize: true, // show gzip size
      brotliSize: true, // show brotli size
    }),
    Components({
      dts: true,
      resolvers: [
        AntDesignVueResolver(),
      ],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
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
