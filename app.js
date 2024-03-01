const express = require("express");
const app = express();
const mongoose = require("mongoose");

const url = process.env.MONGO_DB;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const locationSchema = new mongoose.Schema({
  userId: String,
  latitude: Number,
  longitude: Number,
});

const Location = mongoose.model("Location", locationSchema);

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send("We are liiive");
});

// app.get("/api/yelp", async (req, res) => {
//   const { location, categories } = req.query;
//   const apiKey = process.env.YELP_API_KEY;
//   const url = `https://api.yelp.com/v3/businesses/search?location=${location}&categories=${categories}`;

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error making request to Yelp API:", error.message);
//     if (error.response) {
//       console.error("Response status:", error.response.status);
//       console.error("Response data:", error.response.data);
//       res.status(error.response.status).json({ error: error.message });
//     } else {
//       console.error("No response from Yelp API");
//       res.status(500).json({ error: "Error connecting to Yelp API" });
//     }
//   }
// });

//  handle location data

app.get("/locations", async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Error fetching locations" });
  }
});

app.post("/location", async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  console.log(
    `Received location data - Latitude: ${latitude}, Longitude: ${longitude}`
  );

  const newLocation = new Location({
    userId,
    latitude,
    longitude,
  });
  await newLocation.save();

  res
    .status(200)
    .json({ message: "Location data received and stored successfully" });
});

app.get("/user-locations", async (req, res) => {
  const { userId } = req.query;

  try {
    const locations = await Location.find({ userId });
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching user locations:", error);
    res.status(500).json({ error: "Error fetching user locations" });
  }
});

module.exports = app;
