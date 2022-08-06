const DB = require('./databaseFunctions')

async function calculateSpeedAverage(){
    let result=await DB.returnSpeedData()
    let sum = 0;
    result.forEach(x=>{
        sum += parseFloat(x);
    })
    sum = sum / result.length;
    
    return sum;
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
async function calculateSlopeAndDistance(){
    // import data from databaseFunctions
    let result = await DB.returnAltitude()
    let resultLat = await DB.returnLatitude() 
    let resultLong = await DB.returnLongitude()
    let velocity=await DB.returnSpeedData()
    //initialise variables
    let totalDistance=[]
    let slope=[]
    let totalForce=0
    let expectDspeed=0
    let vehicleForce=0
    let mass = 3900 //kg
    let coeffRr = 0.02 // an estimate
    let coeffAdf=0.36 //an estimate
    let area = 4 //m^2
    let timeDiff = 1  //Estimation of what tarnsmission frequency is designed to be(in s)
    let efficiency=0.9
    let brakingEfficiency=0.65
    let propEnergy = 0;
    let offtakeEnergy=0
    let powerOfftake=100 //W (why? = 100)
    let totalEnergy = 0
    // convert data from strings to floats
    let finalLat = resultLat.map(x=>{
        return parseFloat(x)
    })
    let finalLong = resultLong.map(x=>{
        return parseFloat(x)
    })
    let final = result.map(x=>{
        return parseFloat(x)
    })
    // calculations:
    let radius = 6371; // km
    for(let i=0;i<final.length-1;i++){
        // compute change in elevation
        changeInElev = final[i+1] - final[i];
        if (Math.abs(changeInElev) < 0.2){
            changeInElev = 0
        }
        // compute geodesic distance
        let latDifference = convertToRad(finalLat[i+1]-finalLat[i]);
        let longDifferene = convertToRad(finalLong[i+1]-finalLong[i]);
        let lat1Rad = convertToRad(finalLat[i]);
        let lat2Rad = convertToRad(finalLat[i+1]);
        let temp = Math.sin(latDifference/2) * Math.sin(latDifference/2) + Math.sin(longDifferene/2) * Math.sin(longDifferene/2) *
        Math.cos(lat1Rad) * Math.cos(lat2Rad);
        let lateralDistance= radius * 2 * Math.atan2(Math.sqrt(temp), Math.sqrt(1-temp));
        let hypotDistance = Math.hypot(lateralDistance, changeInElev)
       
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
           
        let fR=rollingResistanceFriction(mass, coeffRr,slope[i],velocity[i])
        let fA=AerodynamicDragForce(coeffAdf,area,velocity[i])
        let fS=RoadSlopeDrag(mass,slope[i])
        totalForce= fR + fA + fS
        expectDspeed=totalForce * timeDiff / mass
        dspeedDiff = velocity[i] - expectDspeed
        vehicleForce = mass * dspeedDiff / timeDiff 
        if (vehicleForce>0){
            propEnergy=vehicleForce * velocity[i] * timeDiff / efficiency
        }
        else{
          propEnergy=brakingEfficiency * vehicleForce * velocity[i] * timeDiff  
        }
        offtakeEnergy= powerOfftake* timeDiff
        totalEnergy += (propEnergy + offtakeEnergy)/3.6 * 10**6
        console.log('total Energy',totalEnergy)
        propEnergy=0
        totalForce=0;
        dSpeed=0;
        expectDspeed=0;
        vehicleForce=0
    }
 console.log('total Energy final',totalEnergy)
 return totalEnergy   
       
}
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
function AerodynamicDragForce(airDragForce, frontSurfaceArea, velocity){
    airDensity=1.184 
    return -0.50 * airDensity * airDragForce * frontSurfaceArea * velocity**2 // negative because it is in opposite direction than the motion
}   
//Road Slope Force (N)
function RoadSlopeDrag(mass, slope){
    gravity=9.81
    return -mass * gravity * Math.sin(slope)
}
   
function convertToRad(a){
return a*Math.PI /180;
}

module.exports={calculateSpeedAverage, returnSpeedForRoute, returnTimeForRoute, ReturnSpeedTimeForRoute,calculateSlopeAndDistance};
