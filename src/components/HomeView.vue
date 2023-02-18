<template>
  <v-container
    class="text-center background-transparency"
    elevation-24
    align-center
  >
    <v-form v-model="validForm" ref="form" lazy-validation>
      <v-row justify="center" align="center">
        <v-col cols="8" sm="6" md="4">
          <v-autocomplete
            class="mx-4"
            v-model="searched"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            :item-text="getItemText"
            item-value="id"
            label="Search for a hotel"
            return-object
            cache-items
            hide-details
            :rules="hotelRules"
            solo
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="6" sm="4" md="4">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="dates"
            persistent
            width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dates"
                label="Date Range"
                prepend-icon="calendar"
                readonly
                v-bind="attrs"
                hide-details
                v-on="on"
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
        <v-col cols="4" sm="2" md="2">
          <v-combobox
            v-model="adults"
            label="Adults"
            :items="adultsItems"
            hide-details
            solo
          ></v-combobox>
        </v-col>
        <v-col cols="8" >
          <v-btn
            class="ma-2"
            :disabled="offerIsLoading"
            :loading="offerIsLoading"
            isLoading="true;"
            index="i;"
            @click="getOfferByHotelId()"
            color="primary"
          >
            Continue
          </v-btn>
        </v-col>
        <v-col cols="8">
          <v-container grid-list-xs>
            <v-alert dense text type="info" v-if="infoAlert">
              {{ alertData }}
            </v-alert>
            <v-alert dense text type="error" v-if="errorAlert">
              {{ alertData }}
            </v-alert>
          </v-container>
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
import router from "@/router";
import axios from "axios";
export default {
  data() {
    return {
      isLoading: false,
      offerIsLoading: false,
      items: [],
      searched: null,
      search: null,
      hotels: [],
      modal: false,
      dates: [],
      adults: [],
      adultsItems: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      validForm: false,
      status: null,
      errorAlert: false,
      infoAlert: false,
      alertData: null,
      dateRules: [(v) => !!v || "Date is required"],
      hotelRules: [],
    };
  },
  watch: {
    search(val) {
      val && val !== this.select && this.searchDebounced(val);
    },
  },

  methods: {
    getItemText(item) {
      return (
        item.name +
        " - " +
        item.address.cityName +
        " - " +
        item.address.countryCode
      );
    },
    allowedDates: (date) => {
      const today = new Date();
      return date > today;
    },
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
            if (res.data.length == 1) {
              this.alertData = res.data[0];
              this.alertInfo = true;
              this.isLoading = false;
              return;
            } else {
              let searchData = res.data.data;
              this.items = searchData;
              this.isLoading = false;
              this.alert = false;
            }
          })
          .catch((err) => {
            this.isLoading = false;
            console.log(err);
          });
        //set timeout to 850ms
      }, 850);
    },
    //get hotel offers by hotelId
    getOfferByHotelId() {
      this.offerIsLoading = true;
      let searchData = {
        hotelId: this.searched.hotelIds[0],
        in: this.dates[0],
        out: this.dates[1],
        adults: this.adults,
      };
      axios
        .get("/offerSearch", {
          params: {
            hotelId: searchData.hotelId,
            in: searchData.in,
            out: searchData.out,
            adults: searchData.adults,
          },
        })
        .then((res) => {
          let resData = res.data;
          if (resData.length == 1) {
            this.offerIsLoading = false;
            this.errorAlert = true;
            this.alertData = resData[0].code + " " + resData[0].detail;
            return;
          } else if (resData.data.length == 0) {
            this.offerIsLoading = false;
            this.infoAlert = true;
            this.alertData = "No offers found for this hotel";
            return;
          } else {
            let offerData = resData.data[0];
            this.errorAlert = false && this.infoAlert == false;
            this.offerIsLoading = false;
            router.push({
              name: "HotelWatch",
              params: {
                hotelOffers: offerData.offers,
                hotelData: {
                  data: offerData.hotel,
                  address: this.searched.address,
                },
              },
            });
          }
        })
        .catch((err) => {
          this.offerIsLoading = false;
          console.log(err);
        });
    },
  },
};
</script>
