let DB = require('./databaseFunctions')
async function calculateSpeedAverage(){
    let result=await DB.returnSpeedData()
    console.log(result)
    var sum = 0;
     result.forEach(function(num) { 
        let temp=parseFloat(num)
        sum += temp
        temp=0; 
        sum += temp
        });
    // for(let i=0;i<result.length;i++){
    //     let temp=parseFloat(result[i])
    //     sum += temp
    //     temp=0;
    //     console.log("    ",sum)
    // }
    let average = sum /result.length;
    console.log(average)
}
module.exports={calculateSpeedAverage};
