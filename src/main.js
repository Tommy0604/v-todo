import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";


/* import the ant-design-vue */
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.less";
import "./styles/global.scss";

const app = createApp(App);
app.config.globalProperties.$AILEMENTE = { size: "large" };

app
  .use(router)
  .use(Antd)
  .mount("#app");
