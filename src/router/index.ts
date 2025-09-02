import { createRouter, createWebHistory } from "vue-router";
import Main from "@/pages/Main.vue";
import CreateAd from "@/pages/CreateAd.vue";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/create-ad",
    name: "CreateAd",
    component: CreateAd,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
