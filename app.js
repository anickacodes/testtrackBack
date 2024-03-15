const express = require("express");
const app = express();
const mongoose = require("mongoose");

require('dotenv').config();

const url = process.env.MONGODB_URI;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const locationSchema = new mongoose.Schema({
  userId: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model("Location", locationSchema);

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send("We are live");
});

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

  const estTimestamp = new Date().toLocaleString(undefined, { hour12: true });

  res.status(200).json({
    message: "Location data received and stored successfully",
    timestamp: estTimestamp,
  });
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
