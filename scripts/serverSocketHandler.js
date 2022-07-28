var socketio = require('socket.io')
let DB = require('./databaseFunctions')
let AuthService = require('./AuthenticationFunctions')
var io;
function startSocket(app){
    io = new socketio.Server(app);
                io.sockets.on('connection', function (socket) {
                        console.log("new connection: " + socket.id);
                        socket.join(socket.id)
                        socket.emit("Welcome")

                        socket.on('disconnect', function () {
                                console.log("device disconnected");

                        });

                        socket.on('connect_device', function (data, fn) {
                                console.log("data from connected device: " + data);
                                for (var col in data) {
                                        console.log(col + " => " + data[col]);
                                }


                        });

                        socket.on('register',(data) =>{
                          AuthService.registerNewUser(data).then(status=>{
                            if(status != -1){
                                    io.to(data.ID).emit("registration_Successful","Account successfully created")
                                   }else{
                                    io.to(data.ID).emit("registration_Failed","Account failed to created")
                                   }
                          })

                        })

                        socket.on('login',(data)=>{
                            console.log('login req: ', data)
                            DB.loginUser(data.username,data.password).then(status => {
                                if(status != -1){
                                    io.to(data.ID).emit("login","Login successful")
                                   }else{
                                    io.to(data.ID).emit("login","Login Failed")
                                   }
                            })
                        })

                        socket.on("getRouteData",(data) =>{
                            console.log("We got here")
                            let str = (Math.random() * (30 - 1) + 1)
                            let num = parseFloat(str);
                            let returnData = {
                                long: 18.85,
                                lat: num,
                            }
                            io.to(data.ID).emit("getRouteData",returnData)
                        })
                       
                });
}

module.exports = { startSocket }