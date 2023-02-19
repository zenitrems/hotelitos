<template>
  <v-row class="center-padding" align="center" justify="center">
    <v-col>
      <v-card class="mx-auto" max-width="800" elevation="12" v-if="!cardHidden">
        <v-card-title>
          <div>
            <h4 class="headline mb-3">
              {{ hotelName }}
            </h4>
          </div>
        </v-card-title>
        <v-card-text class="mb-3">
          <div>
            <span class="font-weight-medium">
              {{ hotelAddress }}
            </span>
          </div>
          <div>
            <span>
              {{ hotelId }}
            </span>
          </div>
        </v-card-text>
        <!-- map -->
        <v-card class="mx-auto" elevation-16 max-width="700">
          <l-map
            class=".mapWrap"
            style="height: 300px"
            :zoom="zoom"
            :center="hotelGeo"
          >
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="hotelGeo">
              <l-popup>
                <span>
                  {{ hotelName }}
                </span>
              </l-popup>
            </l-marker>
          </l-map>
        </v-card>

        <v-card-title primary-title>
          <div>
            <h4 class="headline mb-0">Rooms</h4>
          </div>
        </v-card-title>
        <v-container grid-list-xs>
          <v-card
            v-for="(hotelOffer, i) in hotelOffers"
            :key="i"
            elevation="12"
            class="mx-auto mb-3"
            max-width="770"
          >
            <v-card-text class="justify-center">
              <v-row align="center" justify="center">
                <v-col cols="8" sm="4" md="4" align="center">
                  <div>
                    <v-icon>bed</v-icon>
                    <span>
                      {{ hotelOffer.room.typeEstimated.beds }}
                      {{ hotelOffer.room.typeEstimated.bedType }}
                    </span>
                  </div>
                  <div>
                    <v-icon>payments</v-icon>
                    <span>
                      {{ hotelOffer.price.total }}
                      {{ hotelOffer.price.currency }}
                    </span>
                  </div>
                </v-col>
                <v-col cols="8" sm="4" md="4" align="center">
                  <div>
                    <v-icon>payment</v-icon>
                    <span>
                      {{ hotelOffer.policies.paymentType }}
                    </span>
                  </div>
                  <div>
                    <v-icon>person</v-icon>
                    <span>
                      {{ hotelOffer.guests.adults }}
                    </span>
                  </div>
                </v-col>
                <v-col cols="8" sm="4" md="4" align="center">
                  <v-btn
                    class="ma-2"
                    :disabled="isLoading"
                    color="secondary"
                    :loading="isLoading && i == index"
                    @click="
                      getOfferById(hotelOffer.id);
                      isLoading = true;
                      index = i;
                    "
                    ><v-icon>read_more</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>
      </v-card>
      <v-dialog
        v-model="dialog"
        :overlay="true"
        :persistent="true"
        max-width="800"
        transition="scale-transition"
        origin="center up"
        :loading="isLoading"
        @click:outside="dialog = true"
        v-if="!isLoading"
      >
        <v-card v-if="!isLoading">
          <v-card-title>
            <v-card-text>
              <v-row align="center">
                <v-col cols="8" sm="4" md="4">
                  <div>
                    <span>
                      {{ hotelOfferInfo.checkInDate }}
                    </span>
                    <v-icon>login</v-icon>
                  </div>
                  <div>
                    <span>
                      {{ hotelOfferInfo.checkOutDate }}
                    </span>
                    <v-icon>logout</v-icon>
                  </div>
                </v-col>
                <v-col cols="8" sm="4" md="4">
                  <div>
                    <v-icon>person</v-icon>
                    <span>
                      {{ hotelOfferInfo.guests.adults }}
                    </span>
                  </div>
                  <div>
                    <v-icon>payments</v-icon>
                    <span>
                      {{ hotelOfferInfo.price.total }}
                      {{ hotelOfferInfo.price.currency }}
                    </span>
                  </div>
                </v-col>
                <!--  <v-col cols="8" sm="4" md="4">
                 <div>
                    <v-icon>bed</v-icon>
                    <span>
                      {{ hotelOfferInfo.room.typeEstimated.beds }}
                      {{ hotelOfferInfo.room.typeEstimated.bedType }}
                    </span>
                  </div>
                </v-col> -->
              </v-row>
            </v-card-text>
          </v-card-title>
          <v-card-text>
            <div>
              <span>
                {{ hotelOfferInfo.id }}
              </span>
            </div>
          </v-card-text>
          <v-card-title> Room </v-card-title>
          <v-card-text>
            <div>
              <span>
                {{ hotelOfferInfo.description.text }}
              </span>
            </div>
          </v-card-text>
          <v-card-title> Policy </v-card-title>
          <v-card-text>
            <div>
              <h5>Room description:</h5>
              <span>
                {{ hotelOfferInfo.room.description.text }}
              </span>
            </div>
            <div>
              <h5>Cancellation policy:</h5>
              <span>
                {{ hotelOfferInfo.policies.cancellation }}
              </span>
            </div>
            <div>
              <h5>Payment type</h5>
              <span>
                {{ hotelOfferInfo.policies.paymentType }}
              </span>
            </div>
          </v-card-text>
          <v-card-title> Taxes </v-card-title>
          <v-card-text>
            <v-row>
              <div v-for="(tax, i) in hotelOfferInfo.price.taxes" :key="i">
                <v-col>
                  {{ i }}
                  <div>
                    <h5>Amount:</h5>
                    <span>
                      {{ tax.amount }}
                    </span>
                  </div>
                  <div>
                    <h5>Code:</h5>
                    <span>
                      {{ tax.code }}
                    </span>
                  </div>
                  <div>
                    <h5>Currency:</h5>
                    <span>
                      {{ tax.currency }}
                    </span>
                  </div>
                  <div>
                    <h5>Included:</h5>
                    <span>
                      {{ tax.included }}
                    </span>
                  </div>
                  <div>
                    <h5>Pricing Frequency:</h5>
                    <span>
                      {{ tax.pricingFrequency }}
                    </span>
                  </div>
                  <div>
                    <h5>Pricing Mode:</h5>
                    <span>
                      {{ tax.pricingMode }}
                    </span>
                  </div>
                </v-col>
              </div>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="clearOfferInfo()"> Close </v-btn>
            <v-btn @click="bookOffer()"> Book </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<style>
.center-padding {
  padding-top: 50px;
}

.TextClass {
  white-space: nowrap;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<script>
import axios from "axios";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  data() {
    return {
      hotelId: "",
      hotelName: "",
      hotelGeo: [0, 0],
      hotelOffers: [],
      hotelAddress: "",
      hotelOfferInfo: {
        checkInDate: "",
        checkOutDate: "",
        description: { text: "" },
        guests: { adults: "" },
        id: "",
        policies: {
          paymentType: "",
          cancellation: { description: { text: "" } },
        },
        price: { total: "", currency: "", base: "", taxes: [], variations: {} },
        room: {
          description: { text: "" },
          typeEstimated: { category: "null", beds: "null", bedType: "null" },
        },
      },
      dialog: false,
      index: -1,
      isLoading: false,
      cardHidden: false,
      /* lEAFLEETMAP */
      zoom: 10,
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    };
  },
  created() {
    let routerParams = this.$route.params;
    let rawAddress = routerParams.hotelData.address;
    this.hotelOffers = routerParams.hotelOffers;
    this.hotelData = routerParams.hotelData.data;
    this.hotelAddress =
      rawAddress.cityName +
      " " +
      rawAddress.stateCode +
      ", " +
      rawAddress.countryCode;
    this.hotelId = this.hotelData.id;
    this.hotelName = this.hotelData.name;
    this.hotelGeo = [this.hotelData.latitude, this.hotelData.longitude];
  },
  computed: {},
  methods: {
    clearOfferInfo() {
      this.cardHidden = false;
      this.dialog = false;
      this.hotelOfferInfo = {
        checkInDate: "",
        checkOutDate: "",
        description: { text: "" },
        guests: { adults: "" },
        id: "",
        policies: {
          paymentType: "",
          cancellation: { description: { text: "" } },
        },
        price: { total: "", currency: "", base: "", taxes: [], variations: {} },
        room: {
          description: { text: "" },
          typeEstimated: { category: "", beds: "", bedType: "" },
        },
      };
    },

    getOfferById(idOffer) {
      axios
        .get("/offerById", { params: { offerId: idOffer } })
        .then((res) => {
          let offerInfo = res.data.data.offers[0];
          if (!offerInfo) {
            console.log("No Data");
            this.isLoading = false;
            return;
          } else {
            this.hotelOfferInfo = offerInfo;
            this.isLoading = false;
            this.cardHidden = true;
            this.dialog = true;
            console.log(this.hotelOfferInfo);
          }
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },

    bookOffer() {
      console.log("Book Offer");
    },
  },
};
</script>
