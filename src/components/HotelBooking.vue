<template>
  <v-container class="mx-auto center-padding">
    <v-sheet class="mx-auto" elevation="0" color="white">
      <v-row align="start" justify="center">
        <v-col cols="12" sm="12" md="4">
          <v-container>
            <v-card class="mx-auto">
              <v-card-title primary-title> Booking </v-card-title>
              <v-tabs v-model="tab" color="primary" slider-color="secondary">
                <v-tab v-for="n in offerData.guests.adults" :key="n"
                  >Guest {{ n }}</v-tab
                >
              </v-tabs>
              <v-container>
                <v-tabs-items v-model="tab">
                  <v-tab-item v-for="n in 9" :key="n">
                    <v-form>
                      <v-text-field
                        v-model="title"
                        label="Title"
                        required
                        solo
                      ></v-text-field>
                      <v-text-field
                        v-model="firstName"
                        label="First Name"
                        required
                        solo
                      ></v-text-field>
                      <v-text-field
                        v-model="lastName"
                        label="Last Name"
                        required
                        solo
                      ></v-text-field>
                      <v-text-field
                        v-model="phone"
                        label="Phone"
                        required
                        solo
                      ></v-text-field>
                      <v-text-field
                        v-model="email"
                        label="E-mail"
                        required
                        solo
                      ></v-text-field>
                    </v-form>
                  </v-tab-item>
                </v-tabs-items>
              </v-container>
            </v-card>
          </v-container>
          <v-container>
            <v-card>
              <v-card-title primary-title> Payment </v-card-title>
              <v-container>
                <v-form>
                  <v-text-field
                    v-model="cardNumber"
                    label="Card Number"
                    required
                    solo
                  ></v-text-field>
                  <v-text-field
                    v-model="expiryDate"
                    label="Expiry Data"
                    required
                    solo
                  ></v-text-field>
                </v-form>
              </v-container>
            </v-card>
          </v-container>
          <v-container>
            <v-card class="mx-auto">
              <v-card-title primary-title> Price details</v-card-title>
              <v-card-text>
                <div>
                  Base price:
                  <span
                    >{{ offerData.price.base }}
                    {{ offerData.price.currency }}</span
                  >
                </div>
                <div>
                  Total Price:
                  <span
                    >{{ offerData.price.total }}
                    {{ offerData.price.currency }}</span
                  >
                </div>
              </v-card-text>
            </v-card>
          </v-container>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-container>
            <v-card class="mx-auto">
              <v-card-title primary-title>
                <div>
                  <h4 class="headline mb-3">
                    {{ hotelData.name }}
                  </h4>
                </div>
              </v-card-title>
              <v-card-title> Offer description </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col class="d-flex justify-center">
                    <div>
                      <span>{{ offerData.checkInDate }}</span>
                      <v-spacer></v-spacer>
                      <span>{{ offerData.checkOutDate }}</span>
                    </div>
                  </v-col>
                  <v-col class="d-flex justify-center">
                    <div>
                      <v-icon>person</v-icon>
                      <span>{{ offerData.guests.adults }}</span>
                      <v-spacer></v-spacer>
                      <v-icon>room</v-icon>
                      <span> {{ offerData.roomQuantity }}</span>
                    </div>
                  </v-col>
                  <v-col class="d-flex justify-center">
                    <div>
                      <v-icon>payments</v-icon>
                      <span>
                        {{ offerData.price.total }}
                        {{ offerData.price.currency }}
                      </span>
                      <v-spacer></v-spacer>
                      <v-icon>payment</v-icon>
                      <span> </span>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-title> Room Details </v-card-title>
              <v-card-text>
                <div>
                  <span>
                    {{ offerData.description }}
                  </span>
                </div>
              </v-card-text>
              <v-card-title> Offer Policy </v-card-title>
              <v-card-text>
                <div>
                  <h5>Room description:</h5>
                  <span>
                    {{ offerData.room.description.text }}
                  </span>
                </div>
                <div>
                  <h5>Cancellation policy:</h5>
                  <span>
                    {{ offerData.policies.cancellation }}
                  </span>
                </div>
                <div>
                  <h5>Payment type</h5>
                  <span>
                    {{ offerData.policies.paymentType }}
                  </span>
                </div>
              </v-card-text>
              <v-card-title> Taxes </v-card-title>
              <v-card-text>
                <v-row>
                  <div v-for="(tax, i) in offerData.price.taxes" :key="i">
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
            </v-card>
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-container>
            <v-btn block color="primary" @click="bookOffer()">Book Offer</v-btn>
          </v-container>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  name: "HotelBooking",
  data() {
    return {
      title: "Mr",
      firstName: "John",
      lastName: "Doe",
      phone: "+491234567890",
      email: "email@email.com",

      method: "creditCard",
      vendorCode: "VI",
      cardNumber: "41234123123123123123",
      expiryDate: "2026-01",

      tab: null,

      hotelData: {
        chainCode: "",
        cityCode: "",
        dupeId: "",
        hotelId: "",
        latitude: 0,
        longitude: 0,
        name: "",
        type: "",
      },
      offerData: {
        checkInDate: "",
        checkOutDate: "",
        description: {
          lang: "",
          text: "",
        },
        guests: {
          adults: 0,
        },
        id: "",
        policies: {
          cancelation: {
            description: {
              text: "",
            },
            type: "",
          },
          paymentType: "",
        },
        price: {
          base: "",
          currency: "",
          taxes: [],
          total: "",
          variations: {
            changes: [],
          },
        },
        rateCode: "",
        rateFamilyEstimated: {
          code: "",
          type: "",
        },
        room: {
          description: {
            lang: "",
            text: "",
          },
          typeEstimated: {
            bedType: "",
            beds: 0,
          },
        },
      },

      hotelGeo: [0, 0],
      zoom: 13,
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    };
  },
  mounted() {
    if (!this.$route.params) {
      this.$router.push({ name: "/" });
    } else {
      let routerParams = this.$route.params;
      console.log(routerParams);
      this.hotelData = routerParams.hotelData;
      this.offerData = routerParams.offerData;
      this.hotelGeo = [
        routerParams.hotelData.latitude,
        routerParams.hotelData.longitude,
      ];
    }
  },
  methods: {
    bookOffer() {
      let data = {
        offerId: this.offerData.id,
        guests: [
          {
            name: {
              title: this.title,
              firstName: this.firstName,
              lastName: this.lastName,
            },
            contact: {
              phone: this.phone,
              email: this.email,
            },
          },
        ],
        payments: [
          {
            method: this.method,
            card: {
              vendorCode: this.vendorCode,
              cardNumber: this.cardNumber,
              expiryDate: this.expiryDate,
            },
          },
        ],
        rooms: [],
      };
      console.log(data);

      axios
        .post("/bookingOffer", {
          data: data,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    //computed
  },
  watch: {
    //watch
  },
};
</script>
