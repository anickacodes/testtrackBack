// index.js
const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config();
const cors = require('cors'); // Import the cors package
const yelpApp = require('./app');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Use the cors middleware

app.use(yelpApp);

app.get("/", (req, res) => {
  res.status(200).send('yuuuuurr')
});

app.get('*', (req,res) => {
    res.status(404).send('invalid url')
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
