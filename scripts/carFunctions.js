let DB = require('./databaseFunctions')
let carModel = require("../scripts/models/carModel")


async function addNewCar(data){
    let test = await DB.getallDrivers()
    console.log(test.length)
    let car = new carModel({
        carID: data.name + "-" + test.length,
        name: data.name,
        mass: data.mass,
        area: data.area,
        fuelType: data.fuelType

    })
    let result = await DB.addCar(car)
    if(result == 1){
        return true
    }else{
        return false
    }
}

async function getAllCars(){
    let result = await DB.getAllCars();
    result = result.filter(x =>{
        if(x.operation == "In-use"){
            return x
        }
    })
    return result
}

async function deleteCar(data){
    let result = await DB.deleteCar(data)
    return result
}


module.exports = {addNewCar,getAllCars, deleteCar}
