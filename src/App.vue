  <template>
    <v-app id="app">
      <v-app-bar dense dark>
        <v-menu left bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>menu</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="n in 5" :key="n" @click="() => {}">
              <v-list-item-title>Option {{ n }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <router-link to="/"><v-icon>home</v-icon></router-link> 
        <router-link to="/map"><v-icon>map</v-icon></router-link> 

        <v-spacer></v-spacer>

        
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
      background: #2d2d30;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }
  </style>
