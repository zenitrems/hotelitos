<template>
  <div class="wrapper">
    <v-layout row justify-center>
      <v-flex xs12 sm6 md4 height>
        <v-autocomplete
          v-model="model"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          chips
          clearable
          hide-no-data
          hide-selected
          item-text="name"
          item-value="hotelId"
          label="busca un hotel"
          prepend-icon="hotel"
          return-object
        >
        </v-autocomplete>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-center row fill-height>
      <v-flex md5>
        <v-card class="mx-auto" max-width="320">
          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            height="200px"
          ></v-img>

          <v-card-title></v-card-title>

          <v-card-subtitle> </v-card-subtitle>

          <v-card-actions>
            <v-btn
              color="orange lighten-2"
              text
              @click="hotelLoc(this.hotel.name)"
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

              <v-card-text>
                I'm a thing. But, like most politicians, he promised more
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-flex>
      <v-flex md5 class="mapFlex">
        <v-card>
          <!-- map -->
          <l-map style="height: 623px" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="center">
              <l-popup>
                <span></span>
                <v-spacer> </v-spacer>
                <span><h4>Hotel ID:</h4> </span>
              </l-popup>
            </l-marker>
          </l-map>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<style>
.wrapper {
  padding: 20px;
}
.mapFlex {
  z-index: 0;
}
</style>
<script>
import axios from "axios";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  data() {
    return {
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      zoom: 12,
      center: [21.115, -86.817],

      isLoading: false,
      items: [],
      model: [],
      search: null,

      hotels: [],
      viewGeo: [],
      show: false,
    };
  },
  created() {},
  watch: {
    async search() {
      // Items have already been loaded
      if (this.items > 0) return;
      this.isLoading = true;
      // Lazily load input items
      this.searchDebounced();
    },
  },
  methods: {
    //debounce search query to avoid spamming the server
    searchDebounced() {
      // cancel pending call
      clearTimeout(this._timerId);
      //delay new call
      this._timerId = setTimeout(() => {
        axios
          .get("/search", { params: { keyword: this.search } })
          .then((res) => {
            this.items = res.data.data;
            this.isLoading = false;
          })
          .catch((err) => {
            console.log(err);
            this.isLoading = false;
          });
      }, 800);
    },

    async getList(icaoCode) {
      await axios
        .get("/list", {
          params: {
            icaoCode: icaoCode,
          },
        })
        .then((response) => {
          this.hotels = response.data.data;
          console.log(this.hotels);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    hotelLoc(geoObj) {
      console.log(geoObj);
      this.viewGeo = [this.geoObj.latitude, this.geoObj.longitude];
      console.log(this.viewGeo);
    },
  },
};
</script>
