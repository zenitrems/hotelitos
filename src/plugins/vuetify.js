import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";
import es from "vuetify/lib/locale/es";
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      dark: false,
      options: {
        customProperties: true,
      },
    },
    lang: {
      locales: { es },
      current: "es",
    },
    icons: {
      iconfont: "md",
    },
  });