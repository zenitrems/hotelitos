<template>
  <v-container class="center-padding" fluid fill-height>
    <v-row align="center">
      <v-col cols="12">
        <v-card class="mx-auto" max-width="800" elevation="12">
          <v-img class="white--text align-end" height="300px" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
            <v-card-title>
              <div class="title">
                {{ item.hotel.name }}
              </div>
            </v-card-title>
          </v-img>
          <v-rating background-color="grey" color="red lighten-3" v-model="item.hotel.rating" readonly></v-rating>
          <v-card-text class="pb-0">
            <div class="title">
              Description
            </div>
            <div class="font-weight-medium">
              {{ hotelDescription.text }}
            </div>
          </v-card-text>
          <v-card-text class="pb-0">
            <div class="title">
              Address:
            </div>
            <div class="font-weight-medium">
              {{ addressLine }}, {{ hotelAddress.cityName }},
              {{ hotelAddress.stateCode }} {{ hotelAddress.postalCode }},
              {{ hotelAddress.countryCode }}.
            </div>
          </v-card-text>
          <v-card-text>
            <div class="title">
              Contact:
            </div>
            <div class="font-weight-medium">Phone: {{ contactPhone }}</div>
            <div class="font-weight-medium">Email: {{ contactEmail }}</div>
          </v-card-text>
          <v-container>
            <!-- map -->
            <l-map style="height: 300px" :zoom="zoom" :center="center">
              <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
              <l-marker :lat-lng="center">
                <l-popup>
                  <div>{{ item.hotel.name }}</div>
                </l-popup>
              </l-marker>
            </l-map>
          </v-container>
          <v-expansion-panels focusable flat>
            <v-expansion-panel>
              <v-expansion-panel-header>Amenities</v-expansion-panel-header>
              <v-expansion-panel-content class="text-lowercase" v-for="hotelAmenity in hotelAmenities"
                :key="hotelAmenity">
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
      item: [],
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      zoom: 16,
      center: [],
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
          this.item = res.data.result.data;
          this.hotelDescription = res.data.result.data.hotel.description;
          this.hotelAddress = res.data.result.data.hotel.address;
          this.hotelAmenities = res.data.result.data.hotel.amenities;
          this.hotelOffers = res.data.result.data.offers;
          this.hotelMedia = res.data.result.data.hotel.media;

          this.contactPhone = res.data.result.data.hotel.contact.phone;
          this.contactEmail = res.data.result.data.hotel.contact.email;
          this.contactFax = res.data.result.data.hotel.contact.fax;

          this.center = [this.item.hotel.latitude, this.item.hotel.longitude];

          this.result = res.data.result;

          console.log(this.result);
          //iterate over address.lines
          this.hotelAddress.lines.forEach((line) => {
            this.addressLine = line;
          });

          //status code
          this.statusCode = res.data.statusCode;

          console.log(this.hotelMedia);
          console.log(this.statusCode);
        })

        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
