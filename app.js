const express = require("express");
const app = express();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const locationSchema = new mongoose.Schema({
  userId: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
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

app.get("/user-locations", async (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const locations = await Location.find({ latitude: Number(latitude), longitude: Number(longitude) });
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Error fetching locations" });
  }
});


// app.delete("/user-locations", async (req, res) => {
//   const { latitude, longitude, batchSize } = req.query;
//   const limit = parseInt(batchSize) || 100; 

//   let deletedCount = 0;
//   let page = 1;
//   let shouldContinue = true;

//   try {
//     while (shouldContinue) {
//       const locationsToDelete = await Location.find({ latitude, longitude })
//         .limit(limit)
//         .skip((page - 1) * limit);

//       if (locationsToDelete.length === 0) {
//         shouldContinue = false;
//         break;
//       }

//       const result = await Location.deleteMany({ _id: { $in: locationsToDelete.map(loc => loc._id) } });
//       deletedCount += result.deletedCount;
//       page++;
//     }

//     res.status(200).json({ message: `${deletedCount} locations deleted` });
//   } catch (error) {
//     console.error("Error deleting user locations:", error);
//     res.status(500).json({ error: "Error deleting user locations" });
//   }
// });

async function deleteObjects() {
  try {
    let deletedCount = 0;
    let shouldContinue = true;
    const batchSize = 10;

    while (shouldContinue) {
      const locationsToDelete = await Location.find({
        latitude: 40.8570845,
        longitude: -73.9013218,
      }).limit(batchSize);

      if (locationsToDelete.length === 0) {
        shouldContinue = false;
        break;
      }

      const result = await Location.deleteMany({
        _id: { $in: locationsToDelete.map(loc => loc._id) }
      });

      deletedCount += result.deletedCount;
    }

    console.log(deletedCount + " objects deleted");
  } catch (err) {
    console.error("Error deleting objects:", err);
  }
}

deleteObjects();


deleteObjects();





module.exports = app;
