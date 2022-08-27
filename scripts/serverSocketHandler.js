var socketio = require('socket.io')
let DB = require('./databaseFunctions')
let AuthService = require('./AuthenticationFunctions');
let CalcService = require('./calculationFunctions');
let DriverService = require('./driverFunctions')
let CarService = require('./carFunctions')
const dataService = require('./dataFunctions')
const authConfig = require('./configs/authConfig');
const Car = require('./models/carModel');
var io;
function startSocket(app){
    io = new socketio.Server(app);
                io.sockets.on('connection', function (socket) {
                        console.log("new connection: " + socket.id);
                        socket.join(socket.id)
                        socket.emit("Welcome")
                        CarService.getAllCars();
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
                        //DATA

                        socket.on('calculateDriverData',(data)=>{

                                DriverService.getDriverData(data.driverID).then(driverData =>{
                                        DriverService.getDriverCar(data.driverID).then(carData =>{
                                               
                                                CalcService.calcEnergyUsageKinModel(driverData,carData).then((calcData)=>{
                                                //INTERGRATE WITH VIAN WHEN HE IS DONE
                                                //console.log("driver data: ",driverData)
                                                let waypoints = []
                                                driverData.map(x=>{
                                                        if(x.data.Latitude && x.data.Longitude){
                                                                waypoints.push(`${x.data.Latitude},${x.data.Longitude}`)
                                                        }
                                                })

                                                let dataTime = []
                                                driverData.map(x=>{
                                                        if(x.data.dateAndTime){
                                                                dataTime.push(x.data.dateAndTime)
                                                        }
                                                })

                                                //console.log("car data",carData)
                                                //console.log("waypoints", waypoints)
                                                let result = []
                                                let totalEnergy=calcData[0]
                                                let energyPerSecond=calcData[1]
                                                result.push(waypoints)
                                                result.push(totalEnergy)
                                                result.push(energyPerSecond)
                                                result.push(dataTime)
                                                result.push(data.driverName)
                                                //result.push() calcualtion data
                                                io.to(data.ID).emit('calculateDriverData',result)
                                                })
                                                
                                        })
                                })
                        })

                        socket.on('calculateTotalEnergy', async (data)=>{
                                let drivers = await DriverService.getAllDrivers()
                                let temp = []

                                for(let i = 0; i < drivers.length;i++){
                                        let x = drivers[i]
                                        console.log("#####################################")
                                        console.log(x)
                                        let carData = await DriverService.getDriverCar(x.driverID);
                                        let deviceData = await DriverService.getDriverData(x.driverID)
                                        let result = await CalcService.calcEnergyUsageKinModel(deviceData,carData)
                                        let record = {
                                        driverName: x.name,
                                        driverEnergy: result[0]
                                       }
                                       temp.push(record)
                                }
                                console.log("we did it!")
                                console.log(temp)
                                io.to(data.ID).emit('calculateTotalEnergy',temp)


                        })


                        socket.on("getSpeedData",(data)=>{
                                CalcService.returnSpeedForRoute().then(status=>{
                                        io.to(data.ID).emit('getSpeedData',status)
                                })
                        })

                        socket.on("getGraphData",(data)=>{
                                CalcService.calcEnergyUsageKinModel().then(status=>{
                                        io.to(data.ID).emit('getGraphData',status)
                                })
                        })

                        // socket.on("getBarGraphData",(data)=>{
                        //         CalcService.calcEnergyUsageKinModel().then(status=>{
                        //                 io.to(data.ID).emit('getBarGraphData',status)
                        //         })
                        // })
                        ///////Driver section

                        socket.on("getAllDrivers",(data)=>{
                                DriverService.getAllDrivers().then(status=>{
                                        io.to(data.ID).emit('getAllDrivers',status)
                                })

                        })

                        socket.on("createNewDriver",(data)=>{
                                DriverService.addNewDriver(data).then(status=>{
                                        io.to(data.ID).emit('createNewDriver',status)
                                        DriverService.getAllDrivers().then(status2=>{
                                                console.log("Checkies", status2)
                                                io.to(data.ID).emit('getAllDrivers',status2)
                                        })
                                })
                        })

                        socket.on("deleteDriver",(data)=>{
                                DriverService.deleteDriver(data.driverID).then(status=>{
                                        io.to(data.ID).emit('deleteDriver',status)
                                        DriverService.getAllDrivers().then(status2=>{
                                                io.to(data.ID).emit('getAllDrivers',status2)
                                        })
                                })
                        })

                        socket.on('changeDriverDevice', (data)=>{
                                DriverService.changeDriverDevice(data).then(status=>{
                                        io.to(data.ID).emit('changeDriverDevice',status)
                                        DriverService.getAllDrivers().then(status2=>{
                                                io.to(data.ID).emit('getAllDrivers',status2)
                                        })
                                })
                        })

                        ///////CAR SECTION

                        socket.on("getAllCars",(data)=>{
                                CarService.getAllCars().then(status=>{
                                        io.to(data.ID).emit("getAllCars",status)
                                })
                        })

                        socket.on("createNewCar",(data)=>{
                                CarService.addNewCar(data).then(status=>{
                                        io.to(data.ID).emit("createNewCar",status)
                                        CarService.getAllCars().then(status2=>{
                                                io.to(data.ID).emit("getAllCars",status2)
                                        })
                                })
                        })

                        socket.on("deleteCar",(data)=>{
                                CarService.deleteCar(data.carID).then(status=>{
                                        io.to(data.ID).emit("deleteCar",status)
                                        CarService.getAllCars().then(status2=>{
                                                io.to(data.ID).emit("getAllCars",status2)
                                        })
                                })
                        })
                       
                });
}

module.exports = { startSocket }