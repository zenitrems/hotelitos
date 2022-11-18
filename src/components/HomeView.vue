<template>
  <v-container justify-center fluid fill-height id="BackImg" elevation-24>
    <v-card class="backs" height="73" width="500" elevation-24 dark>
      <v-container fluid>
        <v-autocomplete
          v-model="searched"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          item-text="name"
          item-value="id"
          label="Busca un Hotel"
          return-object
          loader-height="4"
          hidde-no-data
          cache-items
          solo
          dark
          btn
        >
        </v-autocomplete>
        <v-btn @click="hotelSearched(searched)" color="success">text</v-btn>
      </v-container>
    </v-card>
  </v-container>
</template>
<style>
#BackImg {
  background-image: url("@/assets/FiestaAmericanaCondesa.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.backs {
  background-color: rgba(91, 126, 131, 0.459) !important;
}
</style>
<script>
import axios from "axios";
export default {
  data() {
    return {
      isLoading: false,
      items: [],
      searched: [],
      search: null,
      hotels: [],
      show: false,
    };
  },
  watch: {
    search(val) {
      // Items have already been loaded
      if (!val) {
        return;
      }
      this.isLoading = true;
      // Lazily load input items
      this.searchDebounced(val);
    },
  },
  methods: {
    //debounce search query to avoid spamming the server
    searchDebounced() {
      // cancel pending call
      clearTimeout(this._timerId);
      this.isLoading = true;
      //delay new call
      this._timerId = setTimeout(() => {
        axios
          .get("/search", { params: { keyword: this.search } })
          .then((res) => {
            this.items = res.data.data;
            this.status = res.status;
            this.statusText = res.statusText;
            console.log(this.status, this.statusText);
            this.isLoading = false;
          })
          .catch((err) => {
            console.log(err);
            this.isLoading = false;
          });
      }, 850);
    },
    hotelSearched() {
      console.log(this.searched.id);
      this.$router.push({
        name: "HotelWatch",
        query: { id: this.searched.id },
      });
    },
  },
};
</script>
