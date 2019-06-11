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
let token = "";
wss.on('connection', (ws) => {
  console.log('Client Connected')
  ws.on('message', (message) => {
    console.log('Client message')
    
    const msg = JSON.parse(message)
    console.log(msg)

    // Game Master messages
    if (msg.source == "GM") {
      console.log("GM")
      switch (msg.type) {
        case "login":
          console.log(msg)
          if (msg.data.username === "test" && msg.data.password === "testing"){
            console.log('login confirmed')
            token = "test_token"
            ws.send(JSON.stringify({
              source: "Server",
              type: 'login confirmed',
              data: {token: token}
            }))
          } else {
            console.log('login denied')
            ws.send('login denied')
          }
          break

          case "start game":
          sendAllPlayers('start game')
          break
      }
    } // Player messages 
    else if (msg.source == "player") {
      console.log("Player")
      switch (msg.type) {
        case "login":
          const client = request.accept('echo-protocol', request.origin);
          playerList[msg.username] = client
          ws.send("accepted")
          break

        case "items":
          _.forEach(msg.data, (item) => {
            if (_.includes(itemList, item)) {
              itemList[item]++
            } else {
              itemList[item] = 1
            }
          })
          break
      }
    } else {
      console.log("Unauthorized Connection")
      ws.close()
    }

  })

  ws.on('close', () => console.log('Client disconnected'));
});

function sendAllPlayers(msg) {
  playerList.forEach((client) => {
    client.send(msg);
  });
}