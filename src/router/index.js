import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import Completed from "../pages/completed.vue";
import Plans from "../pages/plans.vue";
import myday from "../pages/myday.vue";
import All from "../pages/all.vue";

const routes = [
  { path: '/', redirect: '/myday' },
  {
    path: "/myday",
    name: "myday",
    component: myday,
  },
  {
    path: "/all",
    name: "all",
    component: All,
  },
  {
    path: "/plans",
    name: "plans",
    component: Plans,
  },
  {
    path: "/completed",
    name: "completed",
    component: Completed,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.replace(router.currentRoute.value.fullPath)
export default router;
