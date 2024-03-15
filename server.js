const express = require('express');
const http = require('http');
const WebSocket = require('ws');
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

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received: %s', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
