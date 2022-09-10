<template>
  <v-app>
    <v-main>
      <div class="app">
        <MapView />
      </div>
    </v-main>
  </v-app>
</template>
<style>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: whitesmoke;
}
</style>
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
