let DB = require('./databaseFunctions')
let driverModel = require("../scripts/models/driverModel")
const dataService = require('./dataFunctions')

// If required to re-enter data uncomment [would be better as toggle option but \\\\\i don't want this removed, is useful]:
// getAllDrivers().then(data => {
//     dataService.getAllDeviceData(data)
// })
// Get configuration data of device.
//dataService.getConfigData(4599633);
//Create a New device
//dataService.createNewDevice();


async function getAllDrivers(){
    let result = await DB.getallDrivers()
    result = result.filter(x =>{
        if(x.employement === "employed"){
            return x
        }
    })
    for(i=0; i<result.length; i++){
            //console.log("RESULT HERE!" + result[i].driverID);
        }
    return result;
}


async function addNewDriver(data){
    let test = await DB.getallDrivers()
    let driver = new driverModel({
        driverID: data.name + "-" + test.length,
        name: data.name,
        car: data.car,
        deviceID: data.deviceID

    })
    let result = await DB.addDriver(driver)
    if(result == 1){
        return true
    }else{
        return false
    }
}

async function getDriverData(driverID){
    let deviceID = await DB.getDriverProfile(driverID)

    deviceID = deviceID.driver.deviceID
    let result = await dataService.getDeviceStorage(deviceID)
    return result
}

async function getDriverCar(driverID){
    let car = await DB.getDriverCar(driverID)
    return car
}


async function deleteDriver(data){
    let result = await DB.deleteDriver(data)
    return result
}

async function changeDriverDevice(data){
    let result = await DB.changeDriverDevice(data);
    return result
}


module.exports = {getAllDrivers, addNewDriver, deleteDriver, changeDriverDevice, getDriverData, getDriverCar}