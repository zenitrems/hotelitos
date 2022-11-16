import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/HomeView.vue";

import MapSearch from "@/components/MapView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/map",
    name: "Map",
    component: MapSearch,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
