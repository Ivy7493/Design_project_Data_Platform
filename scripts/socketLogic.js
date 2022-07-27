var socket = io();
let socketID = ""

socket.on("Welcome", (data) => {
    console.log("From Server: ",data)
    socketID = data;
});

