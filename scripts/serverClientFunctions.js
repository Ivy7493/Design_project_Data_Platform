

function RemovedDisconnectedClients(_clients){
    _clients = _clients.filter(x => {
        if(x.socket.connected == true){
          return x
        }
      })
      console.log('Updated list')
      console.log(_clients)
}


module.exports = {RemovedDisconnectedClients};