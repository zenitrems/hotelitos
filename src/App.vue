<template>
  <v-app id="app" :style="{ 'background-Image': randomImage() }">
    <v-app-bar absolute dense dark>
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>menu</v-icon>
          </v-btn>
        </template>
        <v-list dark>
          <v-list-item>
            <router-link to="/"><v-icon>home</v-icon></router-link>
          </v-list-item>
          <v-list-item>
            <router-link to="/map"><v-icon>map</v-icon></router-link>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-container fluid fill-height>
      <v-slide-y-transition mode="out-in">
        <router-view />
      </v-slide-y-transition>
    </v-container>
  </v-app>
</template>
<script lang="js">
export default {
  name: "App",
  data() {
    return {
      images: [
      require("@/assets/Hotel1.webp"),
      require("@/assets/Hotel2.webp"),
      require("@/assets/Hotel3.webp"),
      require("@/assets/Hotel4.webp"),
      require("@/assets/Hotel5.webp"),
      require("@/assets/Hotel6.webp"),
      require("@/assets/Hotel7.webp"),
      require("@/assets/Hotel8.webp"),

     ]
    };
  },
  methods:{
  randomImage() {
      return `url("${
        this.images[Math.floor(Math.random() * this.images.length)]
      }")`;
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,200;8..144,400&display=swap");
#app {
  font-family: "Roboto Flex", sans-serif;
  background: no-repeat center center fixed;
  background-size: cover;
}
</style>
