          <template>
            <v-container fill-height id="wrapper">
              <v-row align="center" justify="center">
                <v-col>
                  <v-container fluid fill-height>
                    <v-autocomplete
                    v-model="searched"
                    :items="items"
                    :loading="isLoading"
                    :search-input.sync="search"
                    no-filter
                    item-text="name"
                    item-value="name"
                    label="busca un hotel"
                    prepend-icon="hotel"
                    return-object
                    cache-items
                    clearable
                    dark
                    >
                  </v-autocomplete>
                </v-container>
                
                <v-container fluid>
                  <v-card class="mx-auto" max-width="500" dark >
                    <v-img
                    src="https://destinationlesstravel.com/wp-content/uploads/2022/05/Birds-eye-view-of-the-Cancun-Hotel-zone-on-a-beautiful-day.jpg.webp"
                    height="200px"
                    ></v-img>
                    <v-card-title v-text="searched.name"></v-card-title>
                    <v-card-subtitle v-text="searched.address"></v-card-subtitle>
                    <v-card-actions>
                      <v-btn
                      color="orange lighten-2"
                      text
                      @click="hotelLoc(searched.geoCode)"
                      >
                      Explore
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="show = !show">
                      <v-icon>{{
                        show ? "keyboard_arrow_up" : "keyboard_arrow_down"
                      }}</v-icon>
                    </v-btn>
                  </v-card-actions>
                  <v-expand-transition>
                    <div v-show="show">
                      <v-divider></v-divider>
                      <v-card-text v-text="searched.geoCode"> </v-card-text>
                    </div>
                  </v-expand-transition>
                </v-card>
              </v-container>

              <v-container>
                <v-card  class="mx-auto" max-width="500" dark>
                  <!-- map -->
                  <l-map
                  class="mapis"
                  style="height: 300px"
                  :zoom="zoom"
                  :center="center"
                  >
                  <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                  <l-marker :lat-lng="center">
                    <l-popup>
                      <span v-text="searched.name"> </span>
                      <v-spacer> </v-spacer>
                      <span v-text="searched.id"></span>
                    </l-popup>
                  </l-marker>
                </l-map>
              </v-card>
            </v-container>
          </v-col>
        </v-row>

      </v-container>
    </template>
    <style>
      #wrapper {
       /*background-color: #d1d1d1 ;*/
     }
     .mapFlex {
      z-index: 0;
    }
    .mapis {
      max-height: 360;
    }
  </style>
  <script>
    import axios from "axios";
    import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
    export default {
      name: "MapView",
      components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
      },
      data() {
        return {
          url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
          attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
          zoom: 15,
          center: [21.115, -86.817],

          isLoading: false,
          items: [],
          searched: [],
          search: null,

          hotels: [],
          show: false,
        };
      },
      watch: {
        search(val) {
                // Items have already been loaded
          if (!val) {
            return;
          }
          this.isLoading = true;
                // Lazily load input items
          this.searchDebounced(val);
        },
      },
      methods: {
              //debounce search query to avoid spamming the server
        searchDebounced() {
                // cancel pending call
          clearTimeout(this._timerId);
          this.isLoading = true;
                //delay new call
          this._timerId = setTimeout(() => {
            axios
            .get("/search", { params: { keyword: this.search } })
            .then((res) => {
              this.items = res.data.data;
                      //console.log(this.items);
              this.isLoading = false;
            })
            .catch((err) => {
              console.log(err);
              this.isLoading = false;
            });
          }, 850);
        },
        hotelLoc(geoCode) {
          this.center = [geoCode.latitude, geoCode.longitude];
        },
      },
    };
  </script>
