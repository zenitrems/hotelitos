<template>
  <v-row class="center-padding justify-center">
    <v-col cols="4">
      <v-container>
        <v-pagination
          class="mx-auto"
          v-model="page"
          :length="Math.ceil(this.cityHotels.length / perPage)"
        ></v-pagination>
      </v-container>
      <v-card
        class="mx-auto mb-3"
        v-for="(paginatedHotel, i) in paginatedHotels"
        :key="i"
      >
        <v-card-title primary-title> {{ paginatedHotel.name }} </v-card-title>
        <v-card-text>
          <p>
            <span>
              {{ paginatedHotel.formatted_address }}
            </span>
            <span>
              <v-rating
                :value="paginatedHotel.rating"
                :max="5"
                color="amber"
                size="9"
                :readonly="true"
              >
              </v-rating>
            </span>
          </p>
          <p>
            <span>
              {{ paginatedHotel.editorial_summary }}
            </span>
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import router from "../router";
/* import axios from "axios";
//qs is used to send array of data in query string
import qs from "qs"; */
export default {
  data() {
    return {
      cityHotels: [],
      page: 1,
      perPage: 5,
    };
  },
  mounted() {
    if (!this.$route.params.data) {
      router.push({ name: "Home" });
    } else {
      let routerParams = this.$route.params.data;
      this.cityHotels = routerParams.cityHotels;
      console.log(this.cityHotels);
    }
  },
  computed: {
    paginatedHotels() {
      return this.cityHotels.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    },
  },
};
</script>
