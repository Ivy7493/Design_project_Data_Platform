const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser')
const mainRouter = require("./routes/mainRoute");
const clientFunctions = require('./scripts/serverClientFunctions')
const databaseFunctions = require('./scripts/databaseFunctions')
const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/scripts')))
app.use(express.static(path.join(__dirname, '/css')))
app.set('view engine', 'html')
app.use("/", mainRouter);


let server = http.createServer(app);
const database = databaseFunctions.connectToDB()


server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});

const io = new Server(server);
connectedClients = []

setInterval(clientFunctions.RemovedDisconnectedClients,1000,connectedClients)

io.on("connection", (socket) => {
    console.log("a user connected");
    io.to(socket.id).emit("Welcome", "Hello")
    let temp = {
      socket: socket,
      ID: socket.id
    }
    connectedClients.push(temp)
    console.log("Client List: ")
    console.log(connectedClients)
});

