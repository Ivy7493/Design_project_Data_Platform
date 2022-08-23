const DB = require('./databaseFunctions')
const fetch=require('node-fetch')


async function calculateSpeedAverage(){
    let result=await DB.returnSpeedData()
    let driver="DriverA"
    let sum = 0;
    result.forEach(x=>{
        sum += parseFloat(x);
    })
    sum = sum / result.length;
    
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
async function calcresultEnergy(){
    let result=await DB.returnResultData()
    let sum = 0;
    // result.forEach(x=>{
    //     sum += parseFloat (x);
    // })
    for(let i=0;i<result.length -2;i++){
        sum += parseFloat (result[i]);
    }
    return sum
}
// calculate energy usage using fuel consumption
// async function calcIceEnergy(){
//     let resultMaf=await DB.returnMafData()
//     let resultAlt = await DB.returnAltitude()
//     let resultLat = await DB.returnLatitude() 
//     let resultLong = await DB.returnLongitude()
//     let velocity=await DB.returnSpeedData()
//     let fuelType=await DB.returnFuelTypeData()
//     // convert data from strings to floats
//     let finalLat = resultLat.map(x=>{
//         return parseFloat(x)
//     })
//     let finalLong = resultLong.map(x=>{
//         return parseFloat(x)
//     })
//     let finalAlt = resultAlt.map(x=>{
//         return parseFloat(x)
//     })
//        // convert data from strings to floats
//        let finalMaf = resultMaf.map(x=>{
//         return parseFloat(x)
//     })
//     //initialise vars
//     let Afr=0
//     let fd=0
//     let fuelConsump=0
//     let energyConv=0
//     let fuelEfficiency = 0 // how much converted into kinetic energy
//     let energyUsagePerKm = 0
//     let energyUsagePerSec = []
//     totalEnergy=0

//     //check which fuel car use: assigne constants
//     if(fuelType===1){ //gasoline
//         Afr = 14.7
//         fd=820 //g/dm3
//         energyConv =  9.61 //1 l: 9.6 kwh
//         fuelEfficiency = 0.25
//      }
//      if(fuelType===4){ //diesel
//        Afr=14.5
//        fd= 750 //g/dm3
//        energyConv = 10.96 //1 l:10.96 kwh
//        fuelEfficiency = 0.3

//        }
//     for(let i=0;i<result.length-1;i++){ 
       
//         fuelFlow=finalMaf*3600 / Afr*fd // l/hr
//         fuelConsump=fuelFlow/velocity[i] //l/km
//         energyUsagePerKm=fuelConsump * energyConv * fuelEfficiency //kwh/km
//         let changeInElev=calcElevchange(finalAlt,i)
//         energyUsagePerSec[i]=energyUsagePerKm * displacement(finalLat,finalLong,changeInElev)
//         totalEnergy +=energyUsagePerSec[i]  

//     }
//     return totalEnergy, energyUsagePerSec
   
// }
async function calcEnergyUsageKinModel(){
    // import data from databaseFunctions
    let resultAlt = await DB.returnAltitude()
    let resultLat = await DB.returnLatitude() 
    let resultLong = await DB.returnLongitude()
    let velocity=await DB.returnSpeedData()
    let mass = await DB.returnCarsMass()
    let area = await DB.returnCarsArea()
    // save start position
    let startLong=resultLong[0] 
    let startLat=resultLat[0] 
    //initialise variables
    let totalDistance=[]
    let slope=[]
    let totalForce=0
    let expectDspeed=0
    let vehicleForce=0
    let coeffRr = 0.02 // an estimate
    let coeffAdf=0.36 //an estimate
    let allCarsTripDur=[]
    let timeDiff = 1  //Estimation of what tarnsmission frequency is designed to be(in s)
    let efficiency=0.9
    let brakingEfficiency=0.65
    let propEnergy = 0;
    let offtakeEnergy=0
    let powerOfftake=100 //W (why? = 100)
    let totalEnergy = 0
    let allEnergyPerSecondData=[[]]
    let energyPerSecondData=[]
    let durationTrip = 0
    let brakingEnergy=0
    let deltaVelocity=0
    let fR=0
    let fS=0
    let fA=0
    let totalEnergyAllCars=[]
    // convert data from strings to floats
    let finalLat = resultLat.map(x=>{
        return parseFloat(x)
    })
    let finalLong = resultLong.map(x=>{
        return parseFloat(x)
    })
    let final = resultAlt.map(x=>{
        return parseFloat(x)
    })
    // calculations:
    let radius = 6371; // km
    for (let k=0; k<mass.length;k++){   
        for(let i=0;i<final.length-1;i++){ //final.length-1;i++){
        
        // compute change in elevation
        changeInElev = calcElevchange(final,i);
        // compute geodesic distance
        
        let hypotDistance = displacement(finalLat,finalLong, changeInElev,radius,i)
        if (i===0){
            totalDistance[i]=0
        }
        else{
            totalDistance[i]=hypotDistance
        }
        if (totalDistance!==0 && changeInElev!==0){
            slope[i]= Math.asin(changeInElev/hypotDistance)
        }
        else {
            slope[i]=0
        }
        // if velocity is below 0.3 equal to 0, small velocities are considered negligible
        if (velocity[i]<0.3){
            velocity[i] = 0
        }
        if (velocity[i+1]<0.3){
            velocity[i+1] = 0
        }

        if (velocity[i]!==0){
        fR=rollingResistanceFriction(mass[k], coeffRr,slope[i],velocity[i]/3.6)
        fA=AerodynamicDragForce(coeffAdf,area[k],velocity[i]/3.6)
        fS=RoadSlopeDrag(mass[k],slope[i])
        }

        deltaVelocity=(velocity[i+1]/3.6) - (velocity[i]/3.6)
        totalForce= fR + fA + fS
        expectDspeed=(totalForce * timeDiff) / mass[k]
        dspeedDiff = deltaVelocity - expectDspeed
        vehicleForce = mass[k] * dspeedDiff / timeDiff
        let temp3=vehicleForce * (velocity[i]/3.6) * timeDiff
        if (temp3>0){

          propEnergy= temp3/efficiency//vehicleForce * velocity[i] * timeDiff / efficiency
        }
        else{
          brakingEnergy= temp3*brakingEfficiency//brakingEfficiency * vehicleForce * velocity[i] * timeDiff  //propEnergy
        }
        offtakeEnergy= powerOfftake* timeDiff
        
        let temp2 = (propEnergy + offtakeEnergy+brakingEnergy)/(3.6 * 10**6)
        totalEnergy += temp2 //(propEnergy + offtakeEnergy)/3.6 * 10**6
        energyPerSecondData[i] = temp2 
        lateralDistance=0
        //set vars to 0
        propEnergy = 0
        brakingEnergy = 0
        durationTrip++
    
    }
    allEnergyPerSecondData[k]=energyPerSecondData
    energyPerSecondData=[]
    allCarsTripDur[k]=durationTrip
    durationTrip=0 
    totalEnergyAllCars[k]=totalEnergy
    totalEnergy=0 
    

}
console.log('Duration of trip for all cars',allCarsTripDur)
console.log('kinmodel energy',allEnergyPerSecondData[0])
console.log('kinmodel energy2',allEnergyPerSecondData[1])
    let driver="DriverA"
    let _time = await returnTimeForRoute()
    let temp = {
        EnergyPerSecond: allEnergyPerSecondData[0], 
        EnergyPerSecond2: allEnergyPerSecondData[1],
       TotalEnergy: totalEnergyAllCars[0],
       TotalEnergy2: totalEnergyAllCars[1],
       Time: _time,
       Driver: driver
    }
    return temp  
}

// kineticmodel using elevation api
async function calcEnergyUsageKinModelApiElev(){
    // import data from databaseFunctions
    let resultLat = await DB.returnLatitude() 
    let resultLong = await DB.returnLongitude()
    let velocity=await DB.returnSpeedData()
    let mass = await DB.returnCarsMass()
    let area = await DB.returnCarsArea()
    //initialise variables
    let totalDistance=[]
    let slope=[]
    let totalForce=0
    let expectDspeed=0
    let vehicleForce=0
    let coeffRr = 0.02 // an estimate
    let coeffAdf=0.36 //an estimate
    let allCarsTripDur=[]
    let timeDiff = 1  //Estimation of what tarnsmission frequency is designed to be(in s)
    let efficiency=0.9
    let brakingEfficiency=0.65
    let propEnergy = 0;
    let offtakeEnergy=0
    let powerOfftake=100 //W (why? = 100)
    let totalEnergy = 0
    let allEnergyPerSecondData=[[]]
    let timeCount = 0
    let durationTrip = 0
    let brakingEnergy=0
    let deltaVelocity=0
    let fR=0
    let fS=0
    let fA=0
    let totalEnergyAllCars=[]
    // elevation api
    let getApiElevation=0
    let resultCoord = await DB.returnCoordinateData() 
    //console.log('helllooo',resultCoord)
    let elevApi=[]
    for(let i=0;i<resultCoord.length;i++){ 
        const url = 'https://api.open-elevation.com/api/v1/lookup?locations='+resultCoord[i]
        // Storing response
        let response = await fetch(url);
            
        // Storing data in form of JSON
        var data = await response.json();
        let array=[]
        for(var j in data) {
            array.push([j,data[j]]);    
                }
        for(var k in array[0][1]) {
            array.push([k,array[0][1][k]]);
            }
        getApiElevation= array[1][1].elevation
                    
        // Calling the elevation api function
        elevApi[i]=getApiElevation;
        getApiElevation=0
        //console.log('elevApi',i,elevApi[i])
        }
    let  finalApi=elevApi //await calcApiElev()
    
    // convert data from strings to floats
    let finalLat = resultLat.map(x=>{
        return parseFloat(x)
    })
    let finalLong = resultLong.map(x=>{
        return parseFloat(x)
    })
    // calculations:
    let radius = 6371; // km
    for (let k=0; k<mass.length;k++){   
        for(let i=0;i<finalApi.length-1;i++){ //final.length-1;i++){
        
        // compute change in elevation
       
        changeInElev=calcElevchange(finalApi,i)
        // compute geodesic distance
        
        let hypotDistance = displacement(finalLat,finalLong, changeInElev,radius,i)
        if (i===0){
            totalDistance[i]=0
        }
        else{
            totalDistance[i]=hypotDistance
        }
        if (totalDistance!==0 && changeInElev!==0){
            slope[i]= Math.asin(changeInElev/hypotDistance)
        }
        else {
            slope[i]=0
        }
        // if velocity is below 0.3 equal to 0, small velocities are considered negligible
        if (velocity[i]<0.3){
            velocity[i] = 0
        }
        if (velocity[i+1]<0.3){
            velocity[i+1] = 0
        }

        if (velocity[i]!==0){
        fR=rollingResistanceFriction(mass[k], coeffRr,slope[i],velocity[i]/3.6)
        fA=AerodynamicDragForce(coeffAdf,area[k],velocity[i]/3.6)
        fS=RoadSlopeDrag(mass[k],slope[i])
        }

        deltaVelocity=(velocity[i+1]/3.6) - (velocity[i]/3.6)
        totalForce= fR + fA + fS
        expectDspeed=(totalForce * timeDiff) / mass[k]
        dspeedDiff = deltaVelocity - expectDspeed
        vehicleForce = mass[k] * dspeedDiff / timeDiff
        let temp3=vehicleForce * (velocity[i]/3.6) * timeDiff
        if (temp3>0){

          propEnergy= temp3/efficiency//vehicleForce * velocity[i] * timeDiff / efficiency
        }
        else{
          brakingEnergy= temp3*brakingEfficiency//brakingEfficiency * vehicleForce * velocity[i] * timeDiff  //propEnergy
        }
        offtakeEnergy= powerOfftake* timeDiff
        
        let temp2 = (propEnergy + offtakeEnergy+brakingEnergy)/(3.6 * 10**6)
        totalEnergy += temp2 //(propEnergy + offtakeEnergy)/3.6 * 10**6
        allEnergyPerSecondData[k,i] = temp2 
        lateralDistance=0
        //set vars to 0
        propEnergy = 0
        brakingEnergy = 0
        durationTrip++
    
    }
    allCarsTripDur[k]=durationTrip
   
    durationTrip=0 
    totalEnergyAllCars[k]=totalEnergy
    totalEnergy=0 
    

}
console.log('Duration of trip for all cars',allCarsTripDur)
console.log('kinmodelAPI',totalEnergyAllCars)
    let driver="DriverA"
    let _time = await returnTimeForRoute()
    let temp = {
       EnergyPerSecond: allEnergyPerSecondData[0],// allEnergyPerSecondData[0]
       TotalEnergy: totalEnergy, //totalEnergyAllCars[0]
       Time: _time,
       Driver: driver
    }
    return temp  
}



//calculate elevation change
function calcElevchange(final,i){
    changeInElev = (final[i+1] - final[i]);
    if ((Math.abs(changeInElev)) < 0.2){
        changeInElev = 0
    }
    return changeInElev
}
// calculate displacement
function displacement(finalLat,finalLong,changeInElev,radius,i){
    let latDifference = convertToRad(finalLat[i+1]-finalLat[i]);
    let longDifferene = convertToRad(finalLong[i+1]-finalLong[i]);
    let lat1Rad = convertToRad(finalLat[i]);
    let lat2Rad = convertToRad(finalLat[i+1]);
    let temp = Math.sin(latDifference/2) * Math.sin(latDifference/2) + Math.sin(longDifferene/2) * Math.sin(longDifferene/2) *
    Math.cos(lat1Rad) * Math.cos(lat2Rad);
    let lateralDistance = radius * 2 * Math.atan2(Math.sqrt(temp), Math.sqrt(1-temp))*10**3;
    let hypotDistance = Math.hypot(lateralDistance, changeInElev)
    return hypotDistance
}
// // elevation from api eleavtion
// async function calcApiElev(){

// let getApiElevation=0
// let resultCoord = await DB.returnCoordinateData() 
// console.log('helllooo',resultCoord)
// let elevApi=[]
//     for(let i=0;i<resultCoord.length-1;i++){ 
//         const url = 'https://api.open-elevation.com/api/v1/lookup?locations='+resultCoord[i]
//             // Storing response
//         let response = await fetch(url);
	
//         // Storing data in form of JSON
//         var data = await response.json();
//         let array=[]
//         for(var j in data) {
//             array.push([j,data[j]]);    
//         }
//     for(var k in array[0][1]) {
//         array.push([k,array[0][1][k]]);
//     }
//     getApiElevation= array[1][1].elevation
            
//         // Calling the elevation api function
//         elevApi[i]=getApiElevation;
//         //console.log('elevApi',i,elevApi[i])
//     }
//    return elevApi
// }

// Defining async function for obtaining elevation api
// async function getApiElevation(url) {
	
//   // Storing response
//   let response = await fetch(url);
	
//   // Storing data in form of JSON
//   var data = await response.json();
//   console.log('api',data)
//   let array=[]
//   for(var i in data) {
//     array.push([i,data[i]]);
// }
// for(var i in array[0][1]) {
//   array.push([i,array[0][1][i]]);
// }
// //console.log('array2',array[1][1].elevation)
// return array[1][1].elevation
// }



//Functions that calculate three environmental forces acting on the vehicle in (N)

//Rolling Resistance (road friction) (N)
function rollingResistanceFriction(mass, rolResistCoeff,slope, velocity) {
    gravity=9.81
    let friction = 0;
    if (velocity>0.3){
        friction = -mass * gravity * rolResistCoeff * Math.cos(slope) // negative because it is in opposite direction than the motion
    }
   return friction
}  

//Aerodynamic Drag Force (N)
function AerodynamicDragForce(airDragForce, frontSurfaceArea, vel){
    airDensity=1.184 
    return -0.50 * airDensity * airDragForce * frontSurfaceArea * (vel**2) // negative because it is in opposite direction than the motion
}   
//Road Slope Force (N)
function RoadSlopeDrag(mass, slope){
    gravity=9.81
    return -mass * gravity * Math.sin(slope)
}
   
function convertToRad(a){
return a*Math.PI /180;
}

module.exports={calculateSpeedAverage, returnSpeedForRoute, returnTimeForRoute, ReturnSpeedTimeForRoute,calcEnergyUsageKinModel,calcEnergyUsageKinModelApiElev,calcresultEnergy};
