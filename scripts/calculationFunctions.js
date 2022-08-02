let DB = require('./databaseFunctions')
async function calculateSpeedAverage(){
    let result=await DB.returnSpeedData()
    console.log(result)
}

module.exports={calculateSpeedAverage};
