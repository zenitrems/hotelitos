//dotenv is a library to load environment variables from a .env file
require("dotenv").config();
//cors is a middleware to allow cross origin requests
const cors = require("cors");
//express is a framework to create a server
const express = require("express");
const app = express();
//morgan is a logger middleware
const morgan = require("morgan");
//body parser is a middleware to parse the body of the request
const bodyParser = require("body-parser");
//Amadeus API Client
const Amadeus = require("amadeus");
//Google Maps API Client
const { Client } = require("@googlemaps/google-maps-services-js");

//server init
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//places client init
const placesClient = new Client({});
//amadeus client init
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

function handlePhoto(photoArray) {
  photoArray.forEach((photo) => {
    placesClient
      .placePhoto({
        params: {
          photoreference: photo.photo_reference,
          key: process.env.GOOGLE_API_KEY,
          maxwidth: photo.width,
          maxheight: photo.height,
        },
        timeout: 1000, // milliseconds
      })
      .then(function (response) {
        let photo = response.request.res.responseUrl;
        /* console.log(photo); */
        return photo;
      })
      .catch(function (responseError) {
        console.log(responseError);
      });
  });
}

function getPlaceInfoById(placeId) {
  return new Promise((resolve, reject) => {
    placesClient
      .placeDetails({
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_API_KEY,
        },
        timeout: 1000, // milliseconds
      })
      .then(function (response) {
        resolve(response.data.result);
      })
      .catch(function (responseError) {
        console.log(responseError);
        reject(responseError);
      });
  });
}

app.get("/cityHotels", async (req, res) => {
  try {
    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: req.query.cityCode,
      radius: "50",
      radiusUnit: "KM",
    });
    if (response.result.data.length > 0) {
      try {
        const getPlaceInfo = await Promise.all(
          response.result.data.map(async (hotel) => {
            const response = await placesClient.findPlaceFromText({
              params: {
                input: hotel.name,
                inputtype: "textquery",
                key: process.env.GOOGLE_API_KEY,
              },
              timeout: 1000, // milliseconds
            });
            if (response.data.candidates.length > 0) {
              try {
                const placeId = await getPlaceInfoById(
                  response.data.candidates[0].place_id
                );
                return placeId;
              } catch (error) {
                console.log(error);
              }
            } else {
              return "No results";
            }
          })
        );
        res.send(getPlaceInfo);
        res.status(200);
      } catch (error) {
        console.log(error);
      }
    } else {
      res.send("No results");
      res.status(400);
    }
  } catch (error) {
    console.log(error);
  }
});

//Aditional Info
app.get("/placeAditionalInfo", async function (req, res) {
  placesClient
    .findPlaceFromText({
      params: {
        input: req.query.hotelName,
        inputtype: "textquery",
        key: process.env.GOOGLE_API_KEY,
      },
      timeout: 1000, // milliseconds
    })
    .then(function (response) {
      if (response.data.candidates.length > 0) {
        placesClient
          .placeDetails({
            params: {
              place_id: response.data.candidates[0].place_id,
              key: process.env.GOOGLE_API_KEY,
            },
            timeout: 1000, // milliseconds
          })
          .then(function (response) {
            res.status(200);
            handlePhoto(response.data.result.photos);
            res.send(response.data.result);
          })
          .catch(function (responseError) {
            console.log(responseError);
            res.send(responseError);
            res.status(500);
          });
      } else {
        res.send(response.data, "No results");
        res.status(400);
        console.log("No results");
      }
    })
    .catch(function (responseError) {
      console.log(responseError);
      res.send(responseError);
    });
});
/* Hotel name autocomplete for keyword 'keyyword' using   HOTEL_GDS  category of search
477	NOT FOUND
1797	INVALID FORMAT
572	INVALID LENGTH
32171	MANDATORY DATA MISSING */
app.get("/search", async (req, res) => {
  amadeus.referenceData.locations.hotel
    .get({
      keyword: req.query.keyword,
      subType: "HOTEL_GDS", //"HOTEL_LEISURE"
      lang: "EN",
    })
    .then(function (response) {
      res.send(response.result);
      res.status(200);
    })
    .catch(function (responseError) {
      console.log(responseError.description);
      res.send(responseError.description);
      res.status(400);
    });
});

app.get("/citySearch", async (req, res) => {
  amadeus.referenceData.locations.cities
    .get({
      keyword: req.query.keyword,
      max: "5",
    })
    .then(function (response) {
      res.send(response.result);
      res.status(200);
    })
    .catch(function (responseError) {
      console.log(responseError.description);
      res.send(responseError.description);
      res.status(400);
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
app.get("/offerSearch", async (req, res) => {
  amadeus.shopping.hotelOffersSearch
    .get({
      hotelIds: req.query.hotelIds,
      adults: req.query.adults,
      checkInDate: req.query.in,
      checkOutDate: req.query.out,
      roomQuantity: req.query.roomQuantity,
      includeClosed: false,
      bestRateOnly: false,
      lang: "EN",
      view: "FULL",
      currency: "USD",
    })
    .then(function (response) {
      if (response.result.data.length > 0) {
        res.send(response.result);
        res.status(200);
      } else {
        res.send(response.result);
        res.status(400);
      }
    })
    .catch(function (responseError) {
      console.log(responseError.description);
      res.send(responseError.description);
      res.status(400);
    });
});

app.get("/offerById", async (req, res) => {
  amadeus.shopping
    .hotelOfferSearch(req.query.offerId)
    .get({
      offerId: req.query.offerId,
      lang: "EN",
    })
    .then(function (response) {
      res.send(response.result);
      res.status(200);
    })
    .catch(function (responseError) {
      console.log(responseError.description);
      res.send(responseError.description);
      res.status(400);
    });
});

app.post("/bookingOffer", (req, res) => {
  console.log(req.body.data);
  amadeus.booking.hotelBookings
    .post(
      JSON.stringify({
        offerId: req.body.data.offerId,
        guests: req.body.data.guests,
        payments: req.body.datapayments,
        rooms: req.body.data.rooms,
      })
    )
    .then(function (response) {
      res.send(response.result);
      res.status(200);
    })
    .catch(function (responseError) {
      console.log(responseError.description);
      res.send(responseError.description);
      res.status(400);
    });
});

var server = app.listen(process.env.PORT, () => {
  console.log("I am running on port = " + server.address().port + "!");
});
