let DB = require('./databaseFunctions')

async function calculateSpeedAverage(){
    let result=await DB.returnSpeedData()
    let driver="DriverA"
    let sum = 0;
    result.forEach(x=>{
        sum += parseFloat(x);
    })
    console.log("Sum before Divide", sum)
    sum = sum / result.length;
    console.log(sum)
    let temp = {
        AveSpeed: sum,
        Driver: driver

    }
    return temp
}

async function returnSpeedForRoute(){
    let result = await DB.returnSpeedData()
    let final = result.map(x=>{
        return parseFloat(x)
    })
    return final;
}


async function returnTimeForRoute(){
    let result = await DB.returnTimeData()
    return result;
}

async function ReturnSpeedTimeForRoute(){
    let sped = await returnSpeedForRoute()
    let _time = await returnTimeForRoute()
    let temp = {
        speed: sped,
        time: _time
    }
    return temp
}

module.exports={calculateSpeedAverage, returnSpeedForRoute, returnTimeForRoute, ReturnSpeedTimeForRoute};
