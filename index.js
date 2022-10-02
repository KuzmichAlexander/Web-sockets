const ws = require('ws')
const path = require("path");
const express = require("express");
const app = express(); // create express app

const wss = new ws.Server({
    port: 777
}, () => console.log('ws server started'))

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

app.use(express.static("builds"));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "builds", "index.html"));
});

app.listen(3000, () => {
    console.log("server started on port 3000");
});

console.log("success")
