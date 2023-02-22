import Vue from "vue";
import App from "./App.vue";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import axios from "axios";

import vuetify from "./plugins/vuetify";
import router from "./router";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
axios.defaults.baseURL = process.env.VUE_APP_AXIOS_BASE_URL;
Vue.config.productionTip = false;
window.Vue = Vue;
new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
