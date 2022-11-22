<template>
  <v-container fill-height>
    <v-row align="center">
      <v-col cols="12">
        <v-card class="mx-auto" max-width="400">
          <v-img 
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>{{ item.hotel.name }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0">{{
            item.hotel.rating
          }} Stars</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>{{item.hotel.address.lines[0]}}</div>
            <div>{{item.hotel.address.cityName}}</div>
            <div>{{item.hotel.address.stateCode}}</div>
            <div>{{item.hotel.address.postalCode}}</div>
            <div>{{item.hotel.address.countryCode}}</div>
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
          this.hotelMedia = res.data.data.hotel.media[0];
          this.statusText = res.statusText;
          this.statusCode = res.status;
          console.log(this.hotelMedia);
          console.log(this.item);
          console.log(this.statusText, this.statusCode);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
