<template>
  <v-container fill-height>
    <v-row align="center">
      <v-col cols="12">
        <v-card class="mx-auto" max-width="700" dark dense>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">
                {{ item.hotel.type }}
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ item.hotel.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Offer
              </v-list-item-subtitle>
              <v-card-text>{{ item.offers }}</v-card-text>
              <v-card-text></v-card-text>
              <v-card-text></v-card-text>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
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
      loading: false,
      item: [],
      show: false,
    };
  },
  created() {
    this.offerByHotelId();
    if (!this.$route.params) {
      return;
    }
    const idString = JSON.stringify(this.$route.params.id);
    console.log(idString);
    this.offerByHotelId(idString);
  },
  methods: {
    offerByHotelId(idString) {
      axios
        .get("/offerSearch", { params: { id: idString } })
        .then((res) => {
          this.item = res.data.data[0];

          this.statusText = res.statusText;
          this.statusCode = res.status;

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
