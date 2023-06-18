<template>
  <v-app id="app" :style="{ 'background-Image': randomImage() }">
    <v-app-bar dense dark>
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
<style lang="scss" scoped>
@import "@/styles/settings.scss";
</style>
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
