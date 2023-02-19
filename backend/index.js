//dotenv is a library to load environment variables from a .env file
require("dotenv").config();
//cors is a middleware to allow cross origin requests
const cors = require("cors");
//socket.io is a library to create a websocket
const socket = require("socket.io");
//express is a framework to create a server
const express = require("express");
const app = express();
//morgan is a logger middleware
const morgan = require("morgan");
//body parser is a middleware to parse the body of the request
const bodyParser = require("body-parser");

//initialize
app.use(
  cors(),
  morgan("dev"),
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true,
  })
);

//amadeus api
var Amadeus = require("amadeus");
var amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

/* Hotel name autocomplete for keyword 'keyyword' using  HOTEL_GDS category of search
477	NOT FOUND
1797	INVALID FORMAT
572	INVALID LENGTH
32171	MANDATORY DATA MISSING */
app.get("/search", function (req, res) {
  amadeus.referenceData.locations.hotel
    .get({
      keyword: req.query.keyword,
      subType: "HOTEL_GDS", //'HOTEL_LEISURE'  FOR AGGREGATORS
      lang: "EN",
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (responseError) {
      console.log(responseError.description);
      res.send(responseError.description);
    });
});

/* Get list of available offers in specific hotels by hotel id
  BAD REQUEST CODES
  23	PASSENGER TYPE NOT SUPPORTED
  61	INVALID CURRENCY CODE
  137	INVALID ADULTS OCCUPANCY REQUESTED
  145	DURATION PERIOD OR DATES INCORRECT
  195	SERVICE RESTRICTION
  249	INVALID RATE CODE
  377	MAX STAY DURATION IS EXCEEDED
  381	INVALID CHECK - IN DATE
  382	INVALID CHECK - OUT DATE
  383	INVALID CITY CODE
  392	INVALID HOTEL CODE
  397	INVALID NUMBER OF ADULTS
  400	INVALID PROPERTY CODE
  404	CHECK_OUT DATE MUST BE FURTHER IN THE FUTURE THAN CHECK - IN DATE
  424	NO HOTELS FOUND WHICH MATCH THIS INPUT
  431	CHECK - OUT DATE IS TOO FAR IN THE FUTURE THAN CHECK - IN DATE
  424	NO HOTELS FOUND WHICH MATCH THIS INPUT
  431	CHECK - OUT DATE IS TOO FAR IN THE FUTURE
  450	INVALID PROVIDER RESPONSE
  451	INVALID CREDENTIALS
  562	RESTRICTED ACCESS FOR THE REQUESTED RATES AND CHAINS
  784	PROVIDER TIME OUT
  790	RATE SECURITY NOT LOADED */
app.get("/offerSearch", (req, res) => {
  amadeus.shopping.hotelOffersSearch
    .get({
      hotelIds: req.query.hotelId,
      adults: req.query.adults,
      checkInDate: req.query.in,
      checkOutDate: req.query.out,
      includeClosed: false,
      bestRateOnly: false,
      lang: "EN",
      view: "FULL",
      currency: "USD",
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (responseError) {
      console.log(responseError.description);
      res.send(responseError.description);
    });
});

app.get("/offerById", (req, res) => {
  amadeus.shopping
    .hotelOfferSearch(req.query.offerId)
    .get({
      offerId: req.query.offerId,
      lang: "EN",
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (responseError) {
      console.log(responseError.description);
      res.send(responseError.description);
    });
});

app.get("/bookingOffer", (req, res) => {
  amadeus.booking.hotelBookings
    .post(
      JSON.stringify({
        offerId: req.query.offerId,
        guests: req.query.guests,
        payments: req.query.payments,
      })
    )
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (responseError) {
      console.log(responseError.description);
      res.send(responseError.description);
    });
});

app.get("/hotelSearch", (req, res) => {
  var hotelId = req.query.hotelId;
  amadeus.referenceData.locations.hotels.byHotels
    .get({
      hotelIds: hotelId,
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (responseError) {
      console.log(responseError.description);
      res.send(responseError.description);
    });
});

let io = socket(server);
io.on("connection", function (socket) {
  console.log("Socket Connection Established with ID :" + socket.id);
});
var server = app.listen(process.env.PORT, () => {
  console.log("I am running on port = " + server.address().port + "!");
});
