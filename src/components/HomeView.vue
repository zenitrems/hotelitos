<template>
  <v-card class="mx-auto text-center background-transparency" elevation-20>
    <v-alert text type="info" v-if="infoAlert">
      {{ alertData }}
    </v-alert>
    <v-alert text type="error" v-if="errorAlert">
      {{ alertData }}
    </v-alert>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-autocomplete
            v-model="searched"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            :item-text="getItemText"
            item-value="id"
            label="Search for a hotel"
            return-object
            :rules="[(v) => !!v || 'Required']"
            :disabled="offerIsLoading"
            cache-items
            prepend-icon="travel_explore"
            hide-details
            solo
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-menu
            v-model="menu"
            ref="menu"
            :close-on-content-click="false"
            :return-value.sync="dates"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="Date Range"
                prepend-icon="date_range"
                readonly
                hide-details
                v-bind="attrs"
                :disabled="offerIsLoading"
                :rules="[(v) => !!v || 'Required']"
                v-on="on"
                solo
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dates"
              no-title
              scrollable
              range
              format="yyyy-MM-dd"
              :allowed-dates="disablePastDates"
              color="secondary"
            >
              <v-btn text color="secondary" @click="menu = false">
                Cancel
              </v-btn>
              <v-btn fab text color="success" @click="$refs.menu.save(dates)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-combobox
            v-model="adults"
            prepend-icon="people"
            label="Adults"
            :items="adultsItems"
            :disabled="offerIsLoading"
            :rules="[(v) => !!v || 'Required']"
            hide-details
            solo
          ></v-combobox>
        </v-col>
        <v-col>
          <v-btn
            class="mt-2"
            :disabled="
              offerIsLoading || isLoading || !searched || !dates || !adults
            "
            :loading="offerIsLoading"
            isLoading="true;"
            index="i;"
            @click="getOfferByHotelId()"
            color="blue"
            outlined
          >
            Search
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<style>
.background-transparency {
  background-color: rgba(233, 240, 255, 0.705) !important;
}
</style>

<script>
import router from "@/router";
import axios from "axios";

export default {
  data() {
    return {
      items: [],
      searched: null,
      search: null,
      menu: false,
      dates: [],

      adults: "",
      adultsItems: [1, 2, 3, 4, 5, 6, 7, 8, 9],

      isLoading: false,
      offerIsLoading: false,

      validForm: false,
      errorAlert: false,
      infoAlert: false,
      alertData: null,
    };
  },
  watch: {
    //watch search query
    search(val) {
      if (val && val.length >= 3) {
        this.searchDebounced();
      } else if (val && val.length <= 3) {
        this.items = [];
        console.log("min 3 chars");
      }
    },
  },

  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },

  methods: {
    resetAlerts() {
      this.errorAlert = false;
      this.infoAlert = false;
    },
    getItemText(item) {
      return (
        item.name +
        " - " +
        item.address.cityName +
        " - " +
        item.address.countryCode
      );
    },
    disablePastDates(val) {
      return val >= new Date().toISOString().substr(0, 10);
    },

    validate() {
      if (this.$refs.form.validate()) {
        alert("Form Submitted!");
      }
    },
    //debounce search query to avoid spamming the server
    searchDebounced() {
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
              this.resetAlerts();
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
            this.errorAlert = true && this.infoAlert == false;
            this.alertData =
              "Code=" +
              resData[0].code +
              " - " +
              resData[0].detail +
              "-" +
              resData[0].tittle;
            return;
          } else if (resData.data.length == 0) {
            this.offerIsLoading = false;
            this.infoAlert = true && this.errorAlert == false;
            this.alertData = "No Offers Found";
            return;
          } else {
            let offerData = resData.data[0];
            this.resetAlerts();
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
