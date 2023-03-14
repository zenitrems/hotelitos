<template>
  <v-row class="center-padding">
    <v-col>
      <v-card
        class="mx-auto mb-3"
        max-width="800"
        elevation="12"
        v-if="!cardHidden"
      >
        <v-container>
          <v-card-title>
            <div>
              <h4 class="headline mb-3">
                {{ hotelName }}
              </h4>
            </div>
          </v-card-title>
          <v-card-text class="mb-3">
            <v-container>
              <div>
                <span>
                  {{ hotelFormatedAddress }}
                </span>
              </div>
              <div>
                <span>
                  {{ hotelFormatedPhone }}
                </span>
              </div>
              <div>
                <span>
                  {{ editorialSummary }}
                </span>
              </div>
            </v-container>
          </v-card-text>
          <!-- map -->
          <v-container class="mb-3">
            <l-map
              class=".mapWrap"
              style="height: 300px"
              :zoom="zoom"
              :center="hotelGeo"
            >
              <l-tile-layer
                :url="url"
                :attribution="attribution"
              ></l-tile-layer>
              <l-marker :lat-lng="hotelGeo">
                <l-popup>
                  <span>
                    {{ hotelName }}
                  </span>
                </l-popup>
              </l-marker>
            </l-map>
          </v-container>
          <v-container fluid>
            <v-slide-group
              class="pa-4"
              v-model="hotelReviews"
              elevation="12"
              show-arrows
            >
              <v-slide-item v-for="(hotelReview, i) in hotelReviews" :key="i">
                <v-container>
                  <v-card
                    class="mx-auto overflow-auto"
                    max-width="600"
                    max-height="300"
                    elevation-11
                  >
                    <v-card-text>
                      <span class="subtitle1">
                        {{ hotelReview.author_name }}
                      </span>
                      <div>
                        <span class="caption">
                          {{ hotelReview.relative_time_description }}
                        </span>
                      </div>
                      <div>
                        <v-rating
                          :value="hotelReview.rating"
                          :max="5"
                          color="amber"
                          size="9"
                          :readonly="true"
                        >
                        </v-rating>
                      </div>
                      <div>
                        <p class="caption text-justify font-weight-thin">
                          {{ hotelReview.text }}
                        </p>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-container>
              </v-slide-item>
            </v-slide-group>
          </v-container>
        </v-container>
      </v-card>
      <v-card class="mx-auto" max-width="800" elevation="12" v-if="!cardHidden">
        <v-card-title primary-title>
          <div>
            <h4 class="headline mb-0">Rooms</h4>
          </div>
          <v-container>
            <v-pagination
              class="mx-auto"
              v-model="page"
              :length="Math.ceil(this.hotelOffers.length / perPage)"
            ></v-pagination>
          </v-container>
        </v-card-title>
        <v-container>
          <v-card
            class="mx-auto mb-3"
            v-for="(paginatedHotelOffer, i) in paginatedHotelOffers"
            :key="i"
            elevation="12"
            max-width="770"
          >
            <v-card-text class="text-center">
              <v-row class="justify-center">
                <v-col cols="4">
                  <div>
                    <v-icon>bed</v-icon>
                    <span>
                      {{ paginatedHotelOffer.room.typeEstimated.beds }}
                      {{ paginatedHotelOffer.room.typeEstimated.bedType }}
                    </span>
                  </div>
                  <v-spacer></v-spacer>
                  <div>
                    <v-icon>payments</v-icon>
                    <span>
                      {{ paginatedHotelOffer.price.total }}
                      {{ paginatedHotelOffer.price.currency }}
                    </span>
                  </div>
                </v-col>
                <v-col cols="4">
                  <div>
                    <v-icon>payment</v-icon>
                    <span>
                      {{ paginatedHotelOffer.policies.paymentType }}
                    </span>
                  </div>
                  <v-spacer></v-spacer>
                  <div>
                    <v-icon>person</v-icon>
                    <span>
                      {{ paginatedHotelOffer.guests.adults }}
                    </span>
                  </div>
                </v-col>
                <v-col class="d-flex justify-center">
                  <v-btn
                    class="ma-2"
                    :disabled="isLoading"
                    color="secondary"
                    :loading="isLoading && i == index"
                    @click="
                      getOfferById(paginatedHotelOffer.id);
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
      <v-col class="d-flex justify-center">
        <v-dialog
          v-model="dialog"
          v-if="!isLoading"
          :overlay="false"
          :persistent="true"
          :loading="isLoading"
          max-width="800"
          scrollable
          dialog-bottom-transition
        >
          <v-card>
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
                  {{ hotelOfferInfo.description }}
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
              <v-btn @click="bookOffer(hotelOfferInfo)"> Book </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-col>
  </v-row>
</template>
<script>
import axios from "axios";
import router from "@/router";
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
      page: 1,
      perPage: 4,
      hotelOffers: [],

      hotelData: {},

      hotelId: "",
      hotelName: "",
      editorialSummary: "",
      hotelGeo: [0, 0],
      hotelFormatedAddress: "",
      hotelFormatedPhone: "",
      hotelReviews: [],
      hotelOfferInfo: {
        checkInDate: "",
        checkOutDate: "",
        description: {},
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
    if (!this.$route.params.hotelData) {
      router.push({ name: "Home" });
    } else {
      let routerParams = this.$route.params;

      let rawAddress = routerParams.hotelData.address;
      this.hotelOffers = routerParams.hotelOffers;
      this.hotelData = routerParams.hotelData.data;
      this.hotelAddress = this.placeAditionalData(
        routerParams.hotelData.data.name
      );
      rawAddress.cityName +
        " " +
        rawAddress.stateCode +
        ", " +
        rawAddress.countryCode;
      this.hotelId = this.hotelData.id;
      this.hotelName = this.hotelData.name;
      this.hotelGeo = [this.hotelData.latitude, this.hotelData.longitude];
    }
  },
  computed: {
    paginatedHotelOffers() {
      return this.hotelOffers.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    },
  },

  methods: {
    clearOfferInfo() {
      this.cardHidden = false;
      this.dialog = false;
      this.hotelOfferInfo = {
        checkInDate: "",
        checkOutDate: "",
        description: {},
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
          }
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },

    bookOffer(hotelOfferInfo) {
      if (!hotelOfferInfo) {
        console.log("No Data");

        return;
      } else {
        router.push({
          name: "HotelBooking",
          params: {
            offerData: hotelOfferInfo,
            hotelData: this.hotelData,
          },
        });
      }
    },
    placeAditionalData(hotelName) {
      axios
        .get("/placeAditionalInfo", { params: { hotelName: { hotelName } } })
        .then((res) => {
          this.hotelFormatedAddress = res.data.formatted_address;
          this.hotelGeo = [
            res.data.geometry.location.lat,
            res.data.geometry.location.lng,
          ];
          this.photoArray = res.data.photos;
          this.editorialSummary = res.data.editorial_summary.overview;
          this.hotelFormatedPhone = res.data.formatted_phone_number;
          this.hotelReviews = res.data.reviews;
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
