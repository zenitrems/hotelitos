<template>
  <v-container class="center-padding" fluid fill-height>
    <v-row align="center">
      <v-col cols="12">
        <v-card class="mx-auto" max-width="800" elevation="12">
          <v-img
            class="white--text align-end"
            height="300px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>
              <div class="title">
                {{ hotelName }}
              </div>
            </v-card-title>
          </v-img>
          <v-rating
            background-color="grey"
            color="red lighten-3"
            v-model="hotelRating"
            readonly
          ></v-rating>
          <v-card-text class="pb-0">
            <div class="title">Description</div>
            <div class="font-weight-medium">
              {{ hotelDescription.text }}
            </div>
          </v-card-text>
          <v-card-text class="pb-0">
            <div class="title">Address:</div>
            <div class="font-weight-medium">
              {{ hotelAddressLine }}, {{ hotelAddress.cityName }},
              {{ hotelAddress.stateCode }} {{ hotelAddress.postalCode }},
              {{ hotelAddress.countryCode }}.
            </div>
          </v-card-text>
          <v-card-text>
            <div class="title">Contact:</div>
            <div class="font-weight-medium">
              Phone: {{ hotelContact.phone }}
            </div>
            <div class="font-weight-medium">
              Email: {{ hotelContact.email }}
            </div>
          </v-card-text>
          <v-container>
            <!-- map -->
            <l-map style="height: 300px" :zoom="zoom" :center="hotelGeo">
              <l-tile-layer
                :url="url"
                :attribution="attribution"
              ></l-tile-layer>
              <l-marker :lat-lng="hotelGeo">
                <l-popup>
                  <div>{{ hotelName }}</div>
                </l-popup>
              </l-marker>
            </l-map>
          </v-container>
          <v-expansion-panels focusable flat>
            <v-expansion-panel>
              <v-expansion-panel-header>Amenities</v-expansion-panel-header>
              <v-expansion-panel-content
                class="text-lowercase"
                v-for="hotelAmenity in hotelAmenities"
                :key="hotelAmenity"
              >
                <div>
                  {{ hotelAmenity }}
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>

      <v-col cols="12" v-for="hotelOffer in hotelOffers" :key="hotelOffer.id">
        <v-card class="mx-auto" max-width="800" elevation="12">
          <v-card-title>
            <div>
              {{ hotelOffer.price.base }} {{ hotelOffer.price.currency }}
            </div>
            <v-spacer></v-spacer>
            <div>Check In: {{ hotelOffer.checkInDate }}</div>
            <v-spacer></v-spacer>
            <div>Check Out: {{ hotelOffer.checkOutDate }}</div>
          </v-card-title>
          <v-card-subtitle>
            <div>Habitación: {{ hotelOffer.room.description.text }}</div>
          </v-card-subtitle>
          <v-card-text>
            <div>Tipo de Cama: {{ hotelOffer.room.typeEstimated.bedType }}</div>
            <div>Numero de camas: {{ hotelOffer.room.typeEstimated.beds }}</div>
            <div>Adultos: {{ hotelOffer.guests.adults }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style>
ul#horizontal-list {
  min-width: 696px;
  list-style: none;
  padding-top: 20px;
}

ul#horizontal-list li {
  display: inline;
}

.center-padding {
  padding-top: 50px;
}

.TextClass {
  white-space: nowrap;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mapis {
  max-height: 360;
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
      hotelName: "",
      hotelRating: 0,
      hotelDescription: "",
      hotelAddressLine: "",
      hotelAddress: "",
      hotelContact: "",
      hotelAmenities: "",
      hotelGeo: [0, 0],
      hotelOffers: [],
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      zoom: 16,
    };
  },
  created() {
    if (!this.$route.params.id) {
      return;
    }
    var idHotel = this.$route.params.id[0];
    this.offerByHotelId(idHotel);
    console.log(idHotel);
  },
  methods: {
    offerByHotelId(idHotel) {
      axios
        .get("/offerSearch", { params: { id: idHotel } })
        .then((res) => {
          console.log(res);
          let resData = res.data.result.errors;

          if (!resData) {
            let hotelData = res.data.result.data.hotel;
            let hotelOffer = res.data.result.data.offers;

            this.hotelName = hotelData.name;
            this.hotelRating = parseInt(hotelData.rating);
            this.hotelDescription = hotelData.description;
            this.hotelContact = hotelData.contact;
            this.hotelAddress = hotelData.address;
            this.hotelGeo = [hotelData.latitude, hotelData.longitude];
            this.hotelAmenities = hotelData.amenities;
            this.hotelMedia = hotelData.media;
            this.hotelOffers = hotelOffer;

            //iterate over address.lines
            this.hotelAddress.lines.forEach((line) => {
              this.hotelAddressLine = line;
            });
          } else {
            console.log(resData);
          }
        })

        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
