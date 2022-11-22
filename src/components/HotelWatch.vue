<template>
  <v-container class="center-padding" fluid fill-height>
    <v-row align="center">
      <v-col cols="12">
        <v-card class="mx-auto" max-width="600">
          <v-img class="white--text align-end" height="200px" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
            <v-card-title>{{ item.hotel.name }}</v-card-title>
          </v-img>
          <v-card-subtitle class="pb-0">{{
              item.hotel.rating
          }} Stars</v-card-subtitle>
          <v-card-text class="text--primary">
            Description
            <div>
              {{ hotelDescription.text }}
            </div>
          </v-card-text>
          <v-card-text>
            Address
            <div>{{ hotelAddress }}</div>
          </v-card-text>
          <v-card-text>
            Amenities
            <div>{{ hotelAmenities }}</div>
          </v-card-text>
          <v-card-text>
            Offers
            <div>{{ hotelOffers }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="orange" text> Share </v-btn>
            <v-btn color="orange" text> Explore </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style>
.center-padding {
  padding-top: 30px;
}
</style>
<script>
import axios from "axios";
export default {
  data() {
    return {
      item: [],
    };
  },
  created() {
    if (!this.$route.params) {
      return;
    }
    var idHotel = this.$route.params.id[0];
    console.log(idHotel);
    this.offerByHotelId(idHotel);
  },
  methods: {
    offerByHotelId(idHotel) {
      axios
        .get("/offerSearch", { params: { id: idHotel } })
        .then((res) => {
          this.item = res.data.data;
          this.hotelDescription = res.data.data.hotel.description;
          this.hotelAddress = res.data.data.hotel.address;
          this.hotelAmenities = res.data.data.hotel.amenities;
          this.hotelMedia = res.data.data.hotel.media;

          this.hotelOffers = res.data.data.offers;

          this.body = res.data.body;

          this.statusText = res.statusText;
          this.statusCode = res.status;

          console.log(this.item);
          console.log(this.hotelMedia);

          console.log(this.body);
          console.log(this.statusText, this.statusCode);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
