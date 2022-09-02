<template>
  <div class="wrapper">
    <v-row>
      <v-col>
        <v-container grid-list-xs>
          <v-toolbar flat color="white">
            <v-toolbar-title>Hoteles</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              class="text-xs-center"
              v-model="search"
              append-icon="search"
              label="Búsqueda"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-icon @click="getGeo()">home</v-icon>
          </v-toolbar>
          <v-spacer></v-spacer>
          <v-data-table
            :headers="headers"
            :items="hotels"
            :search="search"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:items="{ hotels }">
              <tr v-for="hotel in hotels" :key="hotel.hotelId">
                <td>{{ hotel.name }}</td>
                <td>{{ hotel.hotelId }}</td>
                <td>{{ hotel.chainCode }}</td>
                <td>
                  <v-icon large class="mr-2" @click="goToHotel(hotel.hotelId)"
                    >map</v-icon
                  >
                </td>
              </tr>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="listHotels">Reload</v-btn>
            </template>
          </v-data-table>
        </v-container>
      </v-col>
      <!-- map -->
      <v-col cols="12" class="text-center">
        <v-container grid-list-xs>
          <l-map style="height: 300px" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker
              v-for="geoDraw in geoDraws"
              :key="geoDraw"
              :lat-lng="geoDraw"
            >
              <l-popup>
                <span> a nice blah</span>
              </l-popup>
            </l-marker>
          </l-map>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>
<style>
.wrapper {
  height: 100%;
}
</style>

<script>
import axios from "axios";
const url = (axios.defaults.baseURL = "http://localhost:3000/");
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
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 12,
      center: [21.115, -86.817],
      hotels: [],
      geoDraws: [],
      search: "",
      headers: [
        { text: "Hotel", align: "left", sortable: false, value: "name" },
        { text: "hotelId", value: "hotelId" },
        { text: "chainCode", value: "chainCode" },
        { text: "Action", value: "action", sortable: false },
      ],
    };
  },
  created() {
    this.listHotels();
  },
  methods: {
    async listHotels() {
      axios
        .get(url + "list")
        .then((response) => {
          this.hotels = response.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async getGeo() {
      axios
        .get(url + "list")
        .then((response) => {
          this.hotels = response.data;
          this.geoDraws = this.hotels.map((hotel) => {
            return [hotel.geoCode.latitude, hotel.geoCode.longitude];
          });
          console.log(this.geoDraws);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    goToHotel(hotelId) {
      console.log(hotelId);
    },
  },
};
</script>
