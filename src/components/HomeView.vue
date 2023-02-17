<template>
  <v-container
    class="text-center background-transparency"
    elevation-24
    align-center
  >
    <v-alert dense text type="info" v-if="alert"> {{ alertData }} </v-alert>
    <v-form v-model="validForm" ref="form" lazy-validation>
      <v-row justify="center" align="center">
        <v-col cols="8" sm="4" md="4">
          <v-autocomplete
            class="mx-4"
            v-model="autocomplete"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            item-text="name"
            item-value="id"
            label="Search for a hotel"
            return-object
            loader-height="1"
            hidde-no-data
            cache-items
            :rules="hotelRules"
            rounded
            solo
            color="primary"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="8" sm="4" md="4">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="dates"
            persistent
            width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="Date Range"
                prepend-icon="calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                rounded
                solo
                :rules="dateRules"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dates" scrollable range>
              <v-btn text color="primary" @click="modal = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(dates)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="8" sm="2" md="2">
          <v-combobox
            v-model="adults"
            label="Adults"
            :items="adultsItems"
            rounded
            solo
          ></v-combobox>
        </v-col>
        <v-col cols="8" md="4" sm="4">
          <v-btn @click="hotelSearched" color="primary" rounded>
            Continue
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<style>
.background-transparency {
  background-color: rgba(70, 69, 69, 0.705) !important;
}
</style>
<script>
//axios is a promise based HTTP client for the browser and node.js
import axios from "axios";
export default {
  data() {
    return {
      isLoading: false,
      items: [],
      autocomplete: null,
      search: null,
      hotels: [],
      modal: false,
      dates: ["", ""],
      adults: 1,
      adultsItems: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      validForm: false,
      status: null,
      alert: false,
      alertData: null,
      dateRules: [(v) => !!v || "Date is required"],
      hotelRules: [],
    };
  },
  watch: {
    // watch for changes in the search query
    search(val) {
      val && val !== this.autocomplete && this.searchDebounced(val);
    },
  },
  computed: {
    // return the date range text
    dateRangeText() {
      return this.dates.join(" - ");
    },
    // return the date range text
    hotelName() {
      return this.searched.name;
    },
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        alert("Form Submitted!");
      }
    },
    //debounce search query to avoid spamming the server
    searchDebounced() {
      console.log("validate passed");
      this.isLoading = true;
      //clear previous timeout
      clearTimeout(this._timerId);
      //set new timeout
      this._timerId = setTimeout(() => {
        //get hotels by keyword
        axios
          .get("/search", { params: { keyword: this.search } })
          .then((res) => {
            console.log(res);
            if (res.data.length == 1) {
              this.alert = true;
              this.isLoading = false;
              this.alertData = res.data[0];
              return;
            } else {
              this.alert = false;
              let searchData = res.data.data;
              this.items = searchData;
              this.isLoading = false;
              console.log(this.items);
            }
          })
          .catch((err) => {
            console.log(err);
            this.isLoading = false;
          });
        //set timeout to 850ms
      }, 850);
    },
    hotelSearched() {
      if (this.$refs.form.validate() == false) {
        console.log("validate failed");
        return;
      } else {
        console.log("validate passed");
        this.$router.push({
          name: "HotelWatch",
          params: {
            hotelId: this.items[0].hotelIds,
            inDate: this.dates[0],
            outDate: this.dates[1],
            adults: this.adults,
          },
        });
      }
    },
  },
};
</script>
