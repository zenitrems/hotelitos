import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/components/HomeView.vue";
import MapSearch from "@/components/MapView.vue";
import HotelWatch from "@/components/HotelWatch.vue";
import CityWatch from "@/components/CityWatch.vue";
import HotelBooking from "@/components/HotelBooking.vue";

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
  {
    path: "/cityWatch",
    name: "CityWatch",
    component: CityWatch,
  },
  {
    path: "/hotelBooking",
    name: "HotelBooking",
    component: HotelBooking,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
