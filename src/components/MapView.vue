<template>
  <div class="wrapper">
    <v-layout align-center justify-center row fill-height>
      <v-flex md5>
        <v-container fluid grid-list-md>
          <v-card>
            <v-toolbar flat class="elevation-1 dense">
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
              <v-icon @click="getGeo()">map</v-icon>
            </v-toolbar>
            <v-spacer></v-spacer>
            <v-data-table
              :headers="headers"
              :items="hotels"
              :search="search"
              :items-per-page="15"
              class="elevation-1"
              dense
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
          </v-card>
        </v-container>
      </v-flex>

      <v-flex md5>
        <v-container fluid grid-list-md>
          <v-card>
            <!-- map -->
            <l-map style="height: 620px" :zoom="zoom" :center="center">
              <l-tile-layer
                :url="url"
                :attribution="attribution"
              ></l-tile-layer>
              <l-marker
                v-for="item in geoDraws"
                :key="item.hotelId"
                :lat-lng="item.geoObj"
              >
                <l-popup>
                  <span>{{ item.hotelName }}</span>
                  <v-spacer> </v-spacer>
                  <span
                    ><h4>Hotel ID:</h4>
                    {{ item.hotelId }}
                  </span>
                </l-popup>
              </l-marker>
            </l-map>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>
<style>
.wrapper {
  height: 100%;
  background-color: whitesmoke;
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
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      zoom: 12,
      center: [21.115, -86.817],
      hotels: [],
      geoDraws: [],
      search: "",
      headers: [
        { text: "Hotel", align: "left", sortable: false, value: "name" },
        { text: "hotelId", value: "hotelId", sortable: false },
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
          this.listHotel = this.hotels.map((hotel) => {
            return {
              chainCode: hotel.chainCode,
              iataCode: hotel.iataCode,
              dupeId: hotel.dupeId,
              hotelName: hotel.name,
              hotelId: hotel.hotelId,
              geoObj: {
                lat: hotel.geoCode.latitude,
                lon: hotel.geoCode.longitude,
              },
              distanceObj: {
                value: hotel.distance.value,
                unit: hotel.distance.unit,
              },
            };
          });
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
            return {
              hotelId: hotel.hotelId,
              hotelName: hotel.name,
              geoObj: {
                lat: hotel.geoCode.latitude,
                lon: hotel.geoCode.longitude,
              },
            };
          });
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
