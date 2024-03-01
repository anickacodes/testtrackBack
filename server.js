const express = require('express');
const app = express();

require('dotenv').config();
const cors = require('cors'); 
const yelpApp = require('./app');

const PORT = process.env.PORT ;

app.use(express.json());
app.use(cors()); 

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
