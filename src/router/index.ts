import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
const Completed = () => import("../pages/completed.vue");
const Plans = () => import("../pages/plans.vue");
const myday = () => import("../pages/myday.vue");
const All = () => import("../pages/all.vue");

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
  history: createWebHistory('/v-todo/'),
  routes,
});
router.replace(router.currentRoute.value.fullPath)
export default router;
