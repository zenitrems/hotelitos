<template>
  <v-row align="center" justify="center" class="center-padding">
    <v-col cols="12" md="6" sm="6">
      <v-card class="mx-auto" max-width="800" elevation="12">
        <v-img
          class="white--text align-end"
          max-height="300"
          contain
          :src="hotelMedia.uri"
        >
        </v-img>
        <v-card-title>
          <div class="title" style="color: black">
            {{ hotelName }}
          </div>
        </v-card-title>
        <v-card-text class="pb-0">
          <div class="title">Country Code:</div>
          <div class="font-weight-medium">
            {{ hotelAddress }}
          </div>
        </v-card-text>
        <v-container>
          <!-- map -->
          <l-map style="height: 300px" :zoom="zoom" :center="hotelGeo">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="hotelGeo">
              <l-popup>
                <div>{{ hotelName }}</div>
              </l-popup>
            </l-marker>
          </l-map>
        </v-container>
        <!-- <v-expansion-panels focusable flat>
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
        </v-expansion-panels> -->
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="6">
      <div v-for="hotelOffer in hotelOffers" :key="hotelOffer.id">
        <v-card
          class="mx-auto mb-5"
          max-width="800"
          elevation="12"
          cols="12"
          sm="6"
          md="8"
        >
          <v-card-title>
            <div>
              Base Price: {{ hotelOffer.price.base }}
              {{ hotelOffer.price.currency }}
            </div>
            <v-spacer></v-spacer>
            <div>
              Total Price:
              {{ hotelOffer.price.total }}
            </div>
            <v-spacer></v-spacer>
            <div>Check In: {{ hotelOffer.checkInDate }}</div>
            <v-spacer></v-spacer>
            <div>Check Out: {{ hotelOffer.checkOutDate }}</div>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-subtitle>
            <div>Description {{ hotelOffer.room.description.text }}</div>
          </v-card-subtitle>
          <v-card-text>
            <div>Bed Type: {{ hotelOffer.room.typeEstimated.bedType }}</div>
            <div>Beds: {{ hotelOffer.room.typeEstimated.beds }}</div>
            <div>Adults: {{ hotelOffer.guests.adults }}</div>
          </v-card-text>
          <v-card-text>
            <div>Payment Type: {{ hotelOffer.policies.paymentType }}</div>
            <div>
              Cancelation:
              {{ hotelOffer.policies.cancellation.description.text }},
              {{ hotelOffer.policies.cancellation.type }}
            </div>
            <v-spacer></v-spacer>
            <div>ID: {{ hotelOffer.id }}</div>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>
<style>
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
      hotelGeo: [0, 0],
      hotelAddress: "",
      hotelOffers: [],
      hotelMedia:
        "https://15pictures.com/wp-content/gallery/15-pictures-hotels/hotels-9.jpg",
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      zoom: 16,
    };
  },
  created() {
    let routerParams = this.$route.params;
    if (!routerParams) {
      return;
    }
    console.log(routerParams);
    let inDate = routerParams.dates[0];
    let outDate = routerParams.dates[1];
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    console.log(date);

    this.getHotelById(routerParams.id[0]);
    this.offerByHotelId(routerParams.id[0], inDate, outDate);
  },
  computed: {},
  methods: {
    offerByHotelId(idHotel, inDate, outDate) {
      axios
        .get("/offerSearch", {
          params: { id: idHotel, in: inDate, out: outDate },
        })
        .then((res) => {
          let offerData = res.data.data[0];
          console.log(offerData);
          if (!offerData) {
            console.log("There are no offers for this hotel");
            alert("There are no offers for this hotel");
          } else {
            this.hotelOffers = offerData.offers;
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getHotelById(idHotel) {
      axios
        .get("/hotelSearch", { params: { byHotel: idHotel } })
        .then((res) => {
          
          let dataHotel = res.data.data[0];

          this.hotelName = dataHotel.name;
          this.hotelId = dataHotel.id;
          this.hotelAddress = dataHotel.address.countryCode;
          this.hotelGeo = [
            dataHotel.geoCode.latitude,
            dataHotel.geoCode.longitude,
          ];
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
