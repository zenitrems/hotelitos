<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-skeleton-loader card> </v-skeleton-loader>

        <v-card class="mx-auto" max-width="500"> </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      isLoading: false,
      items: [],
      show: false,
    };
  },
  created() {
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
          this.items = res.data.data;

          this.statusText = res.statusText;
          this.statusCode = res.status;

          console.log(this.items);
          console.log(this.statusText, this.statusCode);
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },
  },
};
</script>
