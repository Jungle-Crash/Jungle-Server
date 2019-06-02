'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
const _ = require('lodash');

const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new SocketServer({ server });

// Global variables
let itemList = []
let playerList = {}

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const msg = JSON.parse(message)

    // Game Master messages
    if (message.client == "GM") {
      switch (message.type) {
        case "login":
          console.log(message)
          this.sendAllPlayers('login confirmed')
          case "start game":
          this.sendAllPlayers('start game')
          break
      }
    } // Player messages 
    else if (message.client == "player") {
      switch (message.type) {
        case "login":
          playerList[msg.username] = client
          ws.send("accepted")
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

sendAllPlayers = (msg) => {
  playerList.forEach((client) => {
    client.send(msg);
  });
}