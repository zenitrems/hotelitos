<template>
  <v-app>
    <v-main>
      <MapView />
    </v-main>
  </v-app>
</template>

<script>
import MapView from "./components/MapView";

export default {
  name: "App",

  components: {
    MapView,
  },

  data: () => ({
    //
  }),
};
</script>
