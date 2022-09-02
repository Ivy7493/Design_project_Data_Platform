const DB = require('./databaseFunctions')
const fetch=require('node-fetch')
const energyModel = require("../scripts/models/energyModel")
const energySecModel = require("../scripts/models/energySecModel")
let dataModel = require("../scripts/models/dataModel");

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
    var myDate = new Date(result*1000);
    let resultTime=0
    let allResultTime=[]
    for(let i=0; i< result.length-1;i++){
        var myDate = new Date(result[i]*1000);
        let resultTime=myDate.toLocaleString();
        allResultTime[i]=resultTime
    }
    return resultTime;
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
    let resultDisp=await DB.returnResultDispData()
    let sum = 0;
    let totalDisp=0
    for(let i=0;i<result.length -2;i++){
        sum += parseFloat (result[i]);
        totalDisp+=resultDisp[i]
    }
    console.log('result total energy kWh', sum)
    console.log('result kWh/km',sum/(totalDisp*10**-3))
    return sum
}
// calculate energy usage using fuel consumption
async function calcIceEnergy(data,car){
    let tempAlt = []
    data.map(x=>{
        tempAlt.push(x.data.Altitude)
    })
    let resultAlt = tempAlt
   
    let tempLat = []
    data.map(x=>{
        tempLat.push(x.data.Latitude)
    })    
    let resultLat = tempLat

    let tempLong = []
    data.map(x=>{
        tempLong.push(x.data.Longitude)
    })    
    let resultLong = tempLong
    let tempVel = []
    data.map(x=>{
        tempVel.push(x.data.Speed)
    })    
    let velocity = tempVel
    let tempDate=[]
    data.map(x=>{
        tempDate.push(x.data.timestamp)
    
    })    
    let dateTime = tempDate
    let tempMaf=[]
    data.map(x=>{
        tempMaf.push(x.data.MAF)
    
    })    
    let resultMaf = tempMaf
    let fuelType = car.Car.fuelType

    let finalLat = resultLat.map(x=>{
        return x
    })
    let finalLong = resultLong.map(x=>{
        return x
    })
    let final = resultAlt.map(x=>{
        return x
    })
       // convert data from strings to floats
       let finalMaf = resultMaf.map(x=>{
        return x
    })
    //initialise vars
    let Afr=0
    let fd=0
    let fuelConsump=0
    let energyConv=0
    let fuelEfficiency = 0 // how much converted into kinetic energy
    let energyUsagePerKm = 0
    let energyUsagePerSec = []
    let totalEnergy=0
    let allTotalEnergy=[]
    let allEnergyUsagePerSec=[[]]
    let fuelFlow=0
    let countMissingVel=0
    let countMissingAlt=0
    let countMissingLat=0
    let countMissingLong=0
    let countWrongVel=0
    let radius = 6371; // km

    //check which fuel car use: assigne constants
    if(fuelType===1){ //gasoline
        Afr = 14.7
        fd= 881//820 //g/dm3
        energyConv =  9.61 //1 l: 9.6 kwh
        fuelEfficiency = 0.25
     }
     if(fuelType===4){ //diesel
       Afr=14.5
       fd= 750 //g/dm3
       energyConv = 10.96 //1 l:10.96 kwh
       fuelEfficiency = 0.3

    }
for(let i=0;i<velocity.length-1;i++){
    if(i===0 && velocity[0]===-1){ // if first value is missing replace with mode
        velocity[0]= 0// or use mode(velocity). Assume vehcile is always at rest when start transmitting
        countMissingVel++
    }
    if(i===0&&final[0]===-1){ // if first value is missing replace with mode
        final[0]= mode(final)
        countMissingAlt++
    
    }
    if(i===0&&finalLat[0]===undefined){ // if first value is missing replace with mode
        finalLat[0]= mode(finalLat)
        countMissingLat++
    }
    if(i===0&&finalLong[0]===undefined){ // if first value is missing replace with mode
        finalLong[0]= mode(finalLong)
        countMissingLong++
    
    }
    if(velocity[i]===-1){
        velocity[i]=velocity[i-1]
        countMissingVel++
    }

    if(final[i]===-1){
        final[i]=final[i-1]
        countMissingAlt++
    }
    if(finalLat[i]===undefined){
        finalLat[i]=finalLat[i-1]
        countMissingLat++
    }
    if(finalLong[i]===undefined){
        finalLong[i]=finalLong[i-1]
        countMissingLong++
    }
}
let AllfuelConsump=[]
    for(let i=0;i<final.length-1;i++){ 
       
        if (velocity[i]>0.3){
        
        fuelFlow=(finalMaf[i]*3600)/(Afr*fd) //l/hr
        fuelConsump=fuelFlow/velocity[i] *100//l/100km
        AllfuelConsump[i]=fuelConsump
        energyUsagePerKm=fuelConsump * energyConv * fuelEfficiency //kwh/km
        let changeInElev=calcElevchange(final,i)
        let s=displacement(finalLat,finalLong,changeInElev,radius,i)
        energyUsagePerSec[i]=energyUsagePerKm * s
        fuelFlow=0  
        fuelConsump=0
        energyUsagePerKm=0
        }
        else {
            energyUsagePerSec[i]=0
            AllfuelConsump[i]=0
        }
        totalEnergy += energyUsagePerSec[i]

    
    }
    console.log(totalEnergy,'totalenergy')
    let sum2=0
    AllfuelConsump.forEach(x=>{
        sum2 += parseFloat(x)
    })
    sum2=sum2/finalLat.length
    console.log(sum2,'allfulelconsump')
    return totalEnergy, energyUsagePerSec
   
}
const mode = arr => {
    const mode = {};
    let max = 0, count = 0;
  
    for(let i = 0; i < arr.length; i++) {
      const item = arr[i];
      
      if(mode[item]) {
        mode[item]++;
      } else {
        mode[item] = 1;
      }
      
      if(count < mode[item]) {
        max = item;
        count = mode[item];
      }
    }
     
    return max;
  };
async function calcEnergyUsageKinModel(data,car){
    //read in variables
    let tempAlt = []
    if(!data){
        return
    }
    data.map(x=>{
        tempAlt.push(x.data.Altitude)
    })
    let resultAlt = tempAlt
    
    let tempLat = []
    data.map(x=>{
        tempLat.push(x.data.Latitude)
    })    
    let resultLat = tempLat

    let tempLong = []
    data.map(x=>{
        tempLong.push(x.data.Longitude)
    })    
    let resultLong = tempLong
    let tempVel = []
    data.map(x=>{
        tempVel.push(x.data.Speed)
    })    
    let resultVelocity = tempVel
    let tempDate=[]
    data.map(x=>{
        tempDate.push(x.data.timestamp)
    
    })    
    let dateTime = tempDate

    let mass = car.Car.mass
    let area = car.Car.area


    // //initialise variables
    let totalDistance=[]
    let slope=[]
    let totalForce=0
    let expectDspeed=0
    let vehicleForce=0
    let coeffRr = 0.01//0.02 // an estimate
    let coeffAdf=car.Car.drag//0.36 //an estimate
    let allCarsTripDur=[]
    let timeDiff = 0  //Estimation of what tarnsmission frequency is designed to be(in s)
    let efficiency=0.9
    let brakingEfficiency=0.65
    let propEnergy = 0;
    let offtakeEnergy=0
    let powerOfftake=100 
    let totalEnergy = 0

    let allEnergyPerSecondData=[[]]

    let energyPerSecondData=[]
    let durationTrip = 0
    let brakingEnergy=0
    let deltaVelocity=0
    let fR=0
    let fS=0
    let fA=0
    let countMissingVel=0
    let countMissingAlt=0
    let countMissingLat=0
    let countMissingLong=0
    let countWrongVel=0
    let timeTotal=[]
    // convert data in format to do operations on
    let finalLat = resultLat.map(x=>{
        return x
    })
    let velocity = resultVelocity.map(x=>{
        return x/3.6
    })
    let finalLong = resultLong.map(x=>{
        return x
    })
    let final = resultAlt.map(x=>{
        return x
    })
    // calculations:
    let radius = 6371; // km
    for(let i=0;i<velocity.length-1;i++){
    
    if(i===0 && velocity[0]===-1){ // if first value is missing replace with mode
        velocity[0]= 0//mode(velocity). Assume vehcile is always at rest when start transmitting
        countMissingVel++
    }
    if(i===0&&final[0]===-1){ // if first value is missing replace with mode
        final[0]= mode(final)
        countMissingAlt++
    
    }
    if(i===0&&finalLat[0]===undefined){ // if first value is missing replace with mode
        finalLat[0]= mode(finalLat)
        countMissingLat++
    }
    if(i===0&&finalLong[0]===undefined){ // if first value is missing replace with mode
        finalLong[0]= mode(finalLong)
        countMissingLong++
    
    }
    if(velocity[i]===-1){
        velocity[i]=velocity[i-1]
        countMissingVel++
    }
    if(final[i]===-1){
        final[i]=final[i-1]
        countMissingAlt++
    }
    if(finalLat[i]===undefined){
        finalLat[i]=finalLat[i-1]
        countMissingLat++
    }
    if(finalLong[i]===undefined){
        finalLong[i]=finalLong[i-1]
        countMissingLong++
    }

}
let instAcc=0
let instAccTotal=[]
let j=0
for(let i=0;i<final.length-1;i++){
timeDiff=(dateTime[i+1]-dateTime[i] )
timeTotal[i]=timeDiff}
timeDiff=0 
    for(let i=0;i<final.length-1;i++){ 
        if(dateTime[i+1]===dateTime[i]){
            dateTime[i+1]=dateTime[i]+1
        }
        timeDiff=(dateTime[i+1]-dateTime[i] )
        if(velocity[i]>60){ //60 in m/s
            velocity[i]=velocity[i]+(velocity[i+1]-velocity[i])/2
            countWrongVel++
            }
        if(i!==0 && (Math.abs(velocity[i]-velocity[i-1])/timeDiff)>6){   //used before:velocity[i+1]/3.6-velocity[i]/3.6)/timeDiff)>6){ 
        velocity[i]= velocity[i-1] + 4*timeDiff 
        if(i!==0 && (velocity[i+1]-velocity[i])/timeDiff>6){
            console.log('again', velocity[i]) //remove 
        }
        countMissingVel++
    }
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
        fR=rollingResistanceFriction(mass, coeffRr,slope[i],velocity[i])
        fA=AerodynamicDragForce(coeffAdf,area,velocity[i])
        fS=RoadSlopeDrag(mass,slope[i])
        }
    
        deltaVelocity=(velocity[i+1]) - (velocity[i])
        totalForce= fR + fA + fS
        expectDspeed=(totalForce * timeDiff) / mass
        dspeedDiff = deltaVelocity - expectDspeed
        vehicleForce = mass * dspeedDiff / timeDiff
        let temp3=vehicleForce * (velocity[i]) * timeDiff
        if (temp3>=0){

          propEnergy= temp3/efficiency
        }
        else{
          brakingEnergy= temp3*brakingEfficiency
          let a=(velocity[i+1]- velocity[i])/(timeTotal[i])
          instAcc=(Math.exp(0.0411/Math.abs(a))) **-1
          instAccTotal[j]=instAcc
          j++
        }
        offtakeEnergy= powerOfftake* timeDiff
        let temp2 = (propEnergy + offtakeEnergy+brakingEnergy)/(3.6 * 10**6)

        totalEnergy += temp2 

        energyPerSecondData[i] = temp2

        lateralDistance=0
        //set vars to 0
        propEnergy = 0
        brakingEnergy = 0
        durationTrip++
        temp2=0
    }
    //calculate total displacement
    let sum=0
    totalDistance.forEach(x=>{
        sum += parseFloat(x*10**-3);
    })
    //calculate average transmission time
    let sum2=0
    timeTotal.forEach(x=>{
        sum2 += parseFloat(x)
    })
    sum2=sum2/finalLat.length
    //calculate dynamic braking efficiency
    let sum3=0
    instAccTotal.forEach(x=>{
        sum3 += parseFloat(Math.abs(x))
    })
    console.log('instAcc avg',sum3/instAccTotal.length)
//console.log('average tiem dff', sum2)
console.log('totalEnergy',totalEnergy) 
console.log('totalEnergy per km',totalEnergy/(sum)) 
//console.log('per sec energy', energyPerSecondData)
return [totalEnergy,energyPerSecondData] //[energyResults,energyPersecondResults] 

}

// kineticmodel using elevation api
async function calcEnergyUsageKinModelApiElev(){
    // import data from databaseFunctions
    let finalApi= await DB.returnAltitude()
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
    let powerOfftake=100
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
    let elevApi=[]
    // for(let i=0;i<resultCoord.length;i++){ 
    //     const url = 'https://api.open-elevation.com/api/v1/lookup?locations='+resultCoord[i]
    //     // Storing response
    //     let response = await fetch(url);
            
    //     // Storing data in form of JSON
    //     var data = await response.json();
    //     let array=[]
    //     for(var j in data) {
    //         array.push([j,data[j]]);    
    //             }
    //     for(var k in array[0][1]) {
    //         array.push([k,array[0][1][k]]);
    //         }
    //     getApiElevation= array[1][1].elevation
                    
    //     // Calling the elevation api function
    //     elevApi[i]=getApiElevation;
    //     getApiElevation=0    
    // }
    //let  finalApi=//await calcApiElev() //elevApi 
    // convert data from strings to floats
    let finalLat = resultLat.map(x=>{
        return parseFloat(x)
    })
    let finalLong = resultLong.map(x=>{
        return parseFloat(x)
    })
    // calculations:
    let radius = 6371; // km
    let sum=0
    for (let k=0; k<mass.length;k++){   
        for(let i=0;i<finalApi.length-1;i++){ 
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

          propEnergy= temp3/efficiency
        }
        else{
          brakingEnergy= temp3*brakingEfficiency
        }
        offtakeEnergy= powerOfftake* timeDiff
        
        let temp2 = (propEnergy + offtakeEnergy+brakingEnergy)/(3.6 * 10**6)
        totalEnergy += temp2
        allEnergyPerSecondData[k,i] = temp2 
        lateralDistance=0
        //set vars to 0
        propEnergy = 0
        brakingEnergy = 0
        durationTrip++
    
    }
    
    
    sum=0
    if(k===0){
        totalDistance.forEach(x=>{
        sum += parseFloat(x*10**-3);
    })

    console.log('kinmodelAPI kWh',totalEnergy)
    console.log('kinmodelAPI kWh/km',totalEnergy/sum)//totalEnergyAllCars)
}
allCarsTripDur[k]=durationTrip
   
    durationTrip=0 
    totalEnergyAllCars[k]=totalEnergy
    totalEnergy=0 
    
}

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
//     }
//    return elevApi
// }

// Defining async function for obtaining elevation api
// async function getApiElevation(url) {
	
//   // Storing response
//   let response = await fetch(url);
	
//   // Storing data in form of JSON
//   var data = await response.json();
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

module.exports={calculateSpeedAverage, returnSpeedForRoute, returnTimeForRoute, ReturnSpeedTimeForRoute,calcEnergyUsageKinModel,calcEnergyUsageKinModelApiElev,calcresultEnergy, calcIceEnergy};
