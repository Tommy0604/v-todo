import { createApp } from "vue";
import router from "./router/index";
import App from "./App.vue";

/* import the ant-design-vue */
import 'ant-design-vue/dist/antd.variable.min.css';
import "./styles/global.scss";

// import i18n
import { i18n } from "./i18n";
import { createPinia } from "pinia";

const app = createApp(App);
app.config.globalProperties.$AILEMENTE = { size: "large" };

app
  .use(router)
  .use(i18n)
  .use(createPinia())
  .mount("#app");
