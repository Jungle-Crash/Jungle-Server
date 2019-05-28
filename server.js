'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');

const _ = require('lodash');

// Global variables
let itemList = []
let users = []

const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new SocketServer({ server });

wss.on('connection', socket => {
  socket.on('message', message => {
    console.log(wss.clients)
    // Game Master messages
    if (message.client == "GM") {
      switch (message.type) {
        case "start game":
          wss.send("start game")
          break
        case "start levels":
          wss.send("start levels")
          break
        case "":
      }
    } // Player messages 
    else if (message.client == "player") {
      switch (message.type) {
        case "connect":
          wss.send("accepted")
          break;

        case "items":
          _.forEach(message.data, (item) => {
            if (_.includes(itemList, item)) {
              itemList[item]++
            } else {
              itemList[item] = 1
            }
          })
          break;
      }

    } else {
      socket.destroy()
    }
  });
});
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(message)
    
      // Game Master messages
      if(message.client == "GM") {
    switch (message.type) {
      case "start game":
        wss.send("start game")
        break
      case "start levels":
        wss.send("start levels")
        break
      case "":
    }
  } // Player messages 
      else if (message.client == "player") {
    switch (message.type) {
      case "connect":
        wss.send("accepted")
        break;

      case "items":
        _.forEach(message.data, (item) => {
          if (_.includes(itemList, item)) {
            itemList[item]++
          } else {
            itemList[item] = 1
          }
        })
        break;
    }
  }
})

ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    console.log(JSON.stringify(client))
    client.send(new Date().toTimeString());
  });
}, 1000);
