let DB = require('./databaseFunctions')
let driverModel = require("../scripts/models/driverModel")


async function getAllDrivers(){
    let result = await DB.getallDrivers()
    result = result.filter(x =>{
        if(x.employement == "employed"){
            return x
        }
    })
    for(i=0; i<result.length; i++){
            console.log("RESULT HERE!" + result[i]);
        }
    return result;
}


async function addNewDriver(data){
    let test = await DB.getallDrivers()
    console.log(test.length)
    let driver = new driverModel({
        driverID: data.name + "-" + test.length,
        name: data.name,
        car: data.car

    })
    let result = await DB.addDriver(driver)
    if(result == 1){
        return true
    }else{
        return false
    }
}


async function deleteDriver(data){
    console.log("What we got in!, ", data)
    let result = await DB.deleteDriver(data)
    console.log("What we got out!, ", result)
    return result
}


module.exports = {getAllDrivers, addNewDriver, deleteDriver}