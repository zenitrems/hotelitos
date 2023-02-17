import "material-design-icons-iconfont/dist/material-design-icons.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";
import es from "vuetify/lib/locale/es";
import en from "vuetify/lib/locale/en";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#3f51b5",
        secondary: "#607d8b",
        accent: "#009688",
        error: "#f44336",
        warning: "#ff5722",
        info: "#ffc107",
        success: "#8bc34a",
      },
    },
  },
  lang: {
    locales: { es, en },
    current: "en",
  },
  icons: {
    iconfont: "md",
  },
});
