const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser')
const mainRouter = require("./routes/mainRoute");
const clientFunctions = require('./scripts/serverClientFunctions')
const databaseFunctions = require('./scripts/databaseFunctions')
const websocket = require("./scripts/serverSocketHandler")
const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/scripts')))
app.use(express.static(path.join(__dirname, '/css')))
app.set('view engine', 'html')
app.use("/", mainRouter);


let server = http.createServer(app);
server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

websocket.startSocket(server)
//setInterval(clientFunctions.RemovedDisconnectedClients,1000,connectedClients)
//needed something



