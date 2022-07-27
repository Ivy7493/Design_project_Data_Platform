

function RemovedDisconnectedClients(_clients){
    _clients = _clients.filter(x => {
        if(x.socket.connected == true){
          return x
        }
      })
}


module.exports = {RemovedDisconnectedClients};