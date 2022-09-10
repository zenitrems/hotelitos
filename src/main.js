import Vue from "vue";
import App from "./App.vue";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import axios from "axios";

import vuetify from "./plugins/vuetify";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});


axios.defaults.baseURL = "http://localhost:3000";
window.Vue = Vue;
Vue.config.productionTip = false;
new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
