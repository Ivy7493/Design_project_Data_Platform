const express = require("express");
const path = require("path");
const http = require("http");
const http2Express = require('http2-express-bridge');
const http2 = require('http2');
const fs = require('fs')
const autopush = require('http2-express-autopush')
const { Server } = require("socket.io");
const {MongoClient} = require('mongodb');
const { readFileSync } = require('fs');
const bodyParser = require('body-parser')
const mainRouter = require("./routes/mainRoute");
const confirmationRouter = require("./routes/confirmationRoute")
const dataRouter = require("./routes/dataRoute")
const clientFunctions = require('./scripts/serverClientFunctions')
const databaseFunctions = require('./scripts/databaseFunctions')
const websocket = require("./scripts/serverSocketHandler")

const app = http2Express(express)
const port = process.env.PORT || 3000

app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(autopush(path.join(__dirname, '/scripts')))
app.use(autopush(path.join(__dirname, '/styling')))
app.use(autopush(path.join(__dirname, '/Misc')))
app.set('view engine', 'html')
app.use("/", mainRouter);
app.use("/confirm", confirmationRouter);
app.use("/data", dataRouter);


const options = {
  key: readFileSync('Certs/domainDecrypt.key'),
  cert: readFileSync('Certs/domain.crt'),
  allowHTTP1: true
}

let server = http2.createSecureServer(options,app);
server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});


websocket.startSocket(server)
//setInterval(clientFunctions.RemovedDisconnectedClients,1000,connectedClients)
//needed something



