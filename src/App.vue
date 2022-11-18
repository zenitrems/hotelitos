<template>
  <v-app id="app">
    <v-app-bar id="appbar" absolute dense dark>
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

<style>
#app {
  background: #444444;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
