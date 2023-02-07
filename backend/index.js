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
  var keywords = req.query.keyword;
  amadeus.referenceData.locations.hotel
    .get({
      keyword: keywords,
      subType: "HOTEL_GDS", //HOTEL_LEISURE FOR AGGREGATORS
      lang: "ES",
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (responseError) {
      console.log("Amadeus API error: ", responseError);
      res.send(responseError);
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
  console.log(req.query);
  var id = req.query.id;
  var inDate = req.query.in;
  var outDate = req.query.out;
  amadeus.shopping.hotelOffersSearch
    .get({
      hotelIds: id,
      checkInDate: inDate,
      checkOutDate: outDate,
      includeClosed: true,
      adults: "1",
      lang: "ES",
      view: "FULL",
      currency: "MXN",
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (responseError) {
      console.log("Amadeus API error: ", responseError);
      res.send(responseError);
    });
});

app.get("/hotelSearch", (req, res) => {
  var idHotel = req.query.byHotel;
  console.log(idHotel);
  amadeus.referenceData.locations.hotels.byHotels
    .get({
      hotelIds: idHotel,
    })
    .then(function (response) {
      res.send(response.result);
      console.log(response);
    })
    .catch(function (responseError) {
      console.log("Amadeus API error: ", responseError);
      res.send(responseError);
    });
});

/* app.post("/date", async function (req, res) {
  console.log(req.body);
  departure = req.body.departure;
  arrival = req.body.arrival;
  locationDeparture = req.body.locationDeparture;
  locationArrival = req.body.locationArrival;
  const response = await amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: locationDeparture,
      destinationLocationCode: locationArrival,
      departureDate: departure,
      adults: "1",
    })
    .catch((err) => console.log(err));
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
}); */

// List hotels by city icao
/* app.get("/list", async function (req, res) {
  console.log(req.query);
  icaoCode = req.query.icaoCode;
  const response = await amadeus.referenceData.locations.hotels.byCity
    .get({
      cityCode: icaoCode,
      radius: "30",
    })
    .catch((x) => console.log(x));
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
}); */

let io = socket(server);
var server = app.listen(process.env.PORT, () => {
  console.log("I am running on port = " + server.address().port);
});
io.on("connection", function (socket) {
  console.log("Socket Connection Established with ID :" + socket.id);
});
