// app.js
const express = require("express");
const app = express();
const axios = require("axios");

app.get("/api/yelp", async (req, res) => {
  const { location, categories } = req.query;
  const apiKey = process.env.YELP_API_KEY;
  const url = `https://api.yelp.com/v3/businesses/search?location=${location}&categories=${categories}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error making request to Yelp API:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      res.status(error.response.status).json({ error: error.message });
    } else {
      console.error("No response from Yelp API");
      res.status(500).json({ error: "Error connecting to Yelp API" });
    }
  }
});

  
module.exports = app;
