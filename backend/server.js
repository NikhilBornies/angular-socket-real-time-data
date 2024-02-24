const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"",
    database:"test"
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send real-time data to connected clients
  const query = 'SELECT * FROM sms'; // Your SQL query here

  const sendRealtimeData = () => {
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return;
      }

      ws.send(JSON.stringify(results)); // Send data as JSON
      // console.log(results);
    });
  };

  sendRealtimeData();

  // Optionally, set up a timer to send updates periodically
  const updateInterval = setInterval(() => {
    sendRealtimeData();
  }, 0.5000); // Adjust the interval as needed

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(updateInterval); // Clear the update timer
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});