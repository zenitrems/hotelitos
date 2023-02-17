<template>
  <v-row class="center-padding" align="center" justify="center">
    <v-col>
      <v-card class="mx-auto" max-width="800" elevation="12" v-if="!cardHidden">
        <v-card-title>
          <div>
            <h4 class="headline mb-0">
              {{ hotelName }}
            </h4>
          </div>
        </v-card-title>
        <v-card-text class="pb-0">
          <div>
            <span class="font-weight-medium">
              {{ cityCode }}
            </span>
          </div>
          <div>
            <span>
              {{ hotelId }}
            </span>
          </div>
        </v-card-text>
        <!-- map -->
        <v-container>
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
        </v-container>

        <v-card-title primary-title>
          <div>
            <h4 class="headline mb-0">Rooms</h4>
          </div>
        </v-card-title>
        <v-container grid-list-xs>
          <v-card
            v-for="hotelOffer in hotelOffers"
            :key="hotelOffer.id"
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
                    :loading="isLoading"
                    :disabled="isLoading"
                    color="secondary"
                    @click="getOfferById(hotelOffer.id)"
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
        origin="center center"
        :loading="isLoading"
        @click:outside="clearOfferInfo()"
        v-if="!isLoading"
      >
        <v-card v-if="!isLoading">
          <v-container>
            <v-card-text>
              <v-row>
                <v-col>
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
                <v-col>
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
                <v-col>
                  <div>
                    <v-icon>bed</v-icon>
                    <span>
                      {{ hotelOfferInfo.room.description.text }}
                    </span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-container>
          <v-container>
            <v-card-text>
              <div>
                <span>
                  {{ hotelOfferInfo.id }}
                </span>
              </div>
            </v-card-text>
          </v-container>
          <v-container grid-list-xs>
            <v-card-text>
              <h4>Room</h4>
              <div>
                <span>
                  {{ hotelOfferInfo.description.text }}
                </span>
              </div>
            </v-card-text>
          </v-container>
          <v-container grid-list-xs>
            <v-card-text>
              <h4>Policy</h4>
              <div>
                <li>
                  Cancellation:
                  {{ hotelOfferInfo.policies.cancellation }}
                </li>
                <li>
                  Payment Type:
                  {{ hotelOfferInfo.policies.paymentType }}
                </li>
              </div>
            </v-card-text>
          </v-container>
          <v-container grid-list-xs>
            <v-card-text>
              <h4>Taxes</h4>
              <v-row>
                <div v-for="tax in hotelOfferInfo.price.taxes" :key="tax.code">
                  <v-col>
                    <li>
                      Amount:
                      {{ tax.amount }}
                    </li>
                    <li>
                      Code:
                      {{ tax.code }}
                    </li>
                    <li>
                      Currency:
                      {{ tax.currency }}
                    </li>
                    <li>
                      Included:
                      {{ tax.included }}
                    </li>
                    <li>
                      Pricing Frequency:
                      {{ tax.pricingFrequency }}
                    </li>
                    <li>
                      Pricing Mode:
                      {{ tax.pricingMode }}
                    </li>
                  </v-col>
                </div>
              </v-row>
            </v-card-text>
          </v-container>
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
.mapWrap {
  z-index: 1;
  height: 300px;
}
</style>
<script>
import router from "@/router";
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
      cityCode: "",
      hotelOffers: [],
      inDate: "",
      outDate: "",
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
        room: { description: {} },
      },
      dialog: false,
      isLoading: false,
      cardHidden: false,
      /* lEAFLEETMAP */
      zoom: 16,
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    };
  },
  created() {
    let routerParams = this.$route.params;
    if (!routerParams) {
      return;
    } else {
      this.getOfferByHotelId(
        routerParams.hotelId[0],
        routerParams.inDate,
        routerParams.outDate,
        routerParams.adults
      );
    }
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
        guests: {},
        id: "",
        policies: {
          paymentType: "",
          cancellation: { description: { text: "" } },
        },
        price: { total: "", currency: "", base: "", taxes: [], variations: {} },
        room: { description: {} },
      };
    },

    getOfferByHotelId(hotelId, inDate, outDate, adults) {
      axios
        .get("/offerSearch", {
          params: {
            hotelId: hotelId,
            in: inDate,
            out: outDate,
            adults: adults,
          },
        })
        .then((res) => {
          let offerData = res.data.data[0];
          if (!offerData) {
            console.log("There are no offers for this hotel");
            alert("There are no offers for this hotel");
            router.push("/");
            return;
          } else {
            this.hotelOffers = offerData.offers;
            this.hotelData = offerData.hotel;

            this.hotelName = this.hotelData.name;
            this.cityCode = this.hotelData.cityCode;
            this.hotelGeo = [this.hotelData.latitude, this.hotelData.longitude];

            this.inDate = inDate;
            this.outDate = outDate;

            console.log(this.hotelOffers, this.hotelData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getOfferById(idOffer) {
      this.isLoading = true;

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
            console.log(this.hotelOfferInfo);
            this.isLoading = false;
            this.cardHidden = true;
            this.dialog = true;
          }
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },

    bookOffer() {
      console.log("Book Offer");
    },
  },
};
</script>
