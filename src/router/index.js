import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/components/HomeView.vue";
import MapSearch from "@/components/MapView.vue";
import HotelWatch from "@/components/HotelWatch.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/map",
    name: "Map",
    component: MapSearch,
  },
  {
    path: "/hotelWatch",
    name: "HotelWatch",
    component: HotelWatch,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
