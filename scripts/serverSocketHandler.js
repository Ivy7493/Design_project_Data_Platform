var socketio = require('socket.io')
let DB = require('./databaseFunctions')
let AuthService = require('./AuthenticationFunctions');
const authConfig = require('./configs/authConfig');
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
                                    io.to(data.ID).emit("registration",1)
                                   }else{
                                    io.to(data.ID).emit("registration","A")
                                   }
                          })

                        })

                        socket.on('login',(data)=>{
                            console.log('login req: ', data)
                            AuthService.loginUser(data).then((status)=>{
                                    io.to(data.ID).emit("login",status)
                            })
                        })

                        socket.on('hasAdminAccess',(data)=>{
                                console.log("WE did get here which is cool")
                                AuthService.hasAdminAccess(data.token).then(status =>{
                                        if(status == true){
                                                io.to(data.ID).emit("hasAdminAccess",true)
                                        }else{
                                                io.to(data.ID).emit('hasAdminAccess',false)
                                        }
                                })
                        })

                        socket.on("getRouteData",(data) =>{
                            console.log("We got here")
                                DB.returnCoordinateData().then(status =>{
                                        io.to(data.ID).emit("getRouteData",status)
                                });
                            
                        })

                        socket.on("getAdminData",(data)=>{
                                AuthService.getAllUsers(data.token).then(status=>{
                                        io.to(data.ID).emit('getAdminData',status)
                                })
                        })

                        socket.on("deleteUser",(data)=>{
                                AuthService.DeleteUser(data).then(status=>{
                                        io.to(data.ID).emit("deleteUser",status)
                                })
                        })

                        socket.on('makeAdmin',(data)=>{
                                AuthService.makeUserAdmin(data).then((status)=>{
                                        io.to(data.ID).emit('makeAdmin',status)
                                })
                        })
                       
                });
}

module.exports = { startSocket }