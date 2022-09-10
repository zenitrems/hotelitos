const cors = require("cors");
const morgan = require("morgan");
const socket = require("socket.io");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(morgan("dev"));
app.use(cors());

const { CLIENT_ID, CLIENT_SECRET } = require("./config");

var http = require("http").createServer(app);
var parse = require("socket.io")(http);

app.use(bodyParser.json()); //json encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//amadeus api
var Amadeus = require("amadeus");
var amadeus = new Amadeus({
  clientId: "j4dlDKxrpBWV3AgiJpFfwR5ZAA8iUbpm",
  clientSecret: "sD6bReG5iIxVXU03",
});

app.post("/date", async function (req, res) {
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
});

// Hotel name autocomplete for keyword 'keyyword' using  HOTEL_GDS category of search
app.get("/search", async function (req, res) {
  console.log(req.query);
  var keywords = req.query.keyword;
  const response = await amadeus.referenceData.locations.hotel
    .get({
      keyword: keywords,
      subType: "HOTEL_GDS",
      lang:"ES" 
    })
    .catch((err) => console.log(err));
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});

// List hotels by city icao
app.get("/list", async function (req, res) {
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
});

/* app.get("/offers", (req, res) => {
  // Get list of available offers in specific hotels by hotel ids
  amadeus.shopping.hotelOffersSearch
    .get({
      hotelIds: "GINYC212",
      adults: "2",
    })
    .then(function (response) {
      res.send(response.result);
    })
    .catch(function (err) {
      console.error(err);
    });
}); */

var server = app.listen(process.env.PORT || 3000, () => {
  console.log("I am running¡¡¡");
});

let io = socket(server);

io.on("connection", function (socket) {
  console.log("Socket Connection Established with ID :" + socket.id);
});
