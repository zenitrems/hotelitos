<template>
  <v-card class="mx-auto background-transparency" elevation-20>
    <v-container grid-list-md>
      <v-alert text type="info" v-if="infoAlert">
        {{ alertData }}
      </v-alert>
      <v-alert text type="error" v-if="errorAlert">
        {{ alertData }}
      </v-alert>

      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-autocomplete
            v-model="searched"
            :items="items"
            :search-input.sync="search"
            :loading="searchQueryLoading"
            :item-text="getItemText"
            item-value="id"
            label="Search for a hotel"
            return-object
            cache-items
            :rules="[(v) => !!v || 'Required']"
            :disabled="offerIsLoading"
            prepend-icon="travel_explore"
            hide-details
            solo
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-html="item.name"></v-list-item-title>
                <v-list-item-subtitle
                  >{{ item.address.cityName }} - {{ item.iataCode }} -
                  {{ item.address.countryCode }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
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
        <v-col cols="6" sm="4" md="2">
          <v-combobox
            v-model="adults"
            prepend-icon="people"
            label="Adults"
            :items="adultsItems"
            :disabled="offerIsLoading"
            :rules="[(v) => !!v || 'Required']"
            hide-details
            solo
          >
          </v-combobox>
        </v-col>
        <v-col cols="6" sm="4" md="2">
          <v-combobox
            v-model="rooms"
            prepend-icon="meeting_room"
            label="Rooms"
            :items="roomsItems"
            :disabled="offerIsLoading"
            :rules="[(v) => !!v || '!required']"
            hide-details
            solo
          >
          </v-combobox>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-btn
            class="mt-1"
            :disabled="
              offerIsLoading ||
              searchQueryLoading ||
              !searched ||
              !dates ||
              !adults ||
              !rooms
            "
            :loading="offerIsLoading"
            index="i;"
            @click="getOfferByHotelId()"
            color="blue"
          >
            Search
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
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
      rooms: "",
      roomsItems: [1, 2, 3, 4, 5, 6, 7, 8, 9],

      searchQueryLoading: false,
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
      if (val && val.length <= 3) {
        console.log("min 3 chars");
      } else if (val && val.length >= 3) {
        this.searchDebounced();
      } else {
        this.items = [];
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
      this.searchQueryLoading = true;
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
              this.searchQueryLoading = false;
              return;
            } else {
              let searchData = res.data.data;
              this.items = searchData;
              this.searchQueryLoading = false;
              this.resetAlerts();
              console.log(searchData);
            }
          })
          .catch((err) => {
            this.searchQueryLoading = false;
            console.log(err);
          });
        //set timeout to 850ms
      }, 850);
    },
    //get hotel offers by hotelId
    getOfferByHotelId() {
      this.offerIsLoading = true;
      let searchData = {
        hotelIds: JSON.stringify(this.searched.hotelIds),
        in: this.dates[0],
        out: this.dates[1],
        adults: this.adults,
        roomQuantity: this.rooms,
      };
      console.log(searchData);
      axios
        .get("/offerSearch", {
          params: {
            hotelIds: searchData.hotelIds,
            in: searchData.in,
            out: searchData.out,
            adults: searchData.adults,
            roomQuantity: searchData.roomQuantity,
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
