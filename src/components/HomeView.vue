<template>
  <v-container justify-center fluid fill-height id="BackImg" elevation-24>
    <v-card class="background-card-color" elevation-24 dark>
      <v-container fluid>
        <v-row justify="center" fill-height>
          <v-col cols="12">
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
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="8">
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="dates"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dates"
                  label="Selecciona un rango de fechas"
                  prepend-icon="calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="dates" scrollable range dark>
                <v-btn text color="primary" @click="modal = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(dates)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="2">
            <v-container grid-list-md>
              <v-btn
                @click="hotelSearched(searched.hotelIds, dates)"
                color="blue"
                >Continuar</v-btn
              >
            </v-container>
          </v-col>
        </v-row>
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
.background-card-color {
  background-color: rgba(2, 3, 19, 0.705) !important;
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
      modal: false,
      dates: ["", ""],
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
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
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
            this.isLoading = false;
            console.log(this.status);
          })
          .catch((err) => {
            console.log(err);
            this.isLoading = false;
          });
      }, 850);
    },
    hotelSearched() {
      this.$router.push({
        name: "HotelWatch",
        params: { id: this.searched.hotelIds, dates: this.dates },
      });
    },
  },
};
</script>
