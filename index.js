const ws = require('ws')
const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 5000;
const server = express()
    .use(express.static("builds"))
    .use((req, res) => res.sendFile(path.join(__dirname, "builds", "index.html")))
    .listen(PORT, () => console.log(`Listening on ${PORT}`)); // create express app

const wss = new ws.Server({server})

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message)
        broadcast(message)
    })
})

function broadcast(message) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}
