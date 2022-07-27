var socket = io();
let socketID = ""

socket.on("Welcome", (data) => {
    console.log("From Server: ",data)
    socketID = data;
});

socket.on("disconnect", () => {
    console.log(socketID); // undefined
    socket.emit("removeClient",socketID)
  });

window.addEventListener('beforeunload', function(event) {
    socket.emit("removeClient",socketID)
});