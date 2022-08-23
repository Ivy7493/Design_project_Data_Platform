const DB = require('./databaseFunctions')
const fetch=require('node-fetch')

async function getDeviceData(deviceID){
    //Write Fetch request here
    let headers = {
        'Authorization': 'FlespiToken pzu9I9BWl8meVol0DUzehLW0FAj21TSejcdR9ECkBOnk0y8rgvtl6gbzEjrt29x9'
    }
    let dataStream;
    await fetch(`https://flespi.io/gw/devices/${deviceID}/messages`, {headers: headers}).then(data=>{
        return data.json()
    }).then(data=>{
       dataStream = data
    })
    
    return dataStream;
}

//weekly function to update all data
function getWeeklyData(){
    setInterval(function(){ // Set interval for checking
        var date = new Date(); // Create a Date object to find out what time it is
        if(date.getHours() === 8 && date.getMinutes() === 0 && date.getDay() === 1){ // Check for Monday 8:00
            // Do stuff
            getAllDeviceData()
            
        }
    }, 60000); // Repeat every 60000 milliseconds (1 minute)
}

//This goes to API And refreshes all known driver device IDs
async function getAllDeviceData(data){
    let drivers = data
    console.log(drivers)
    drivers.map(async x=>{
        console.log(x.deviceID)
        let temp =  await getDeviceData(x.deviceID)
        const entries = Object.entries(temp);
        console.log(entries[0][1])
        entries[0][1].forEach(async y => {
            let result = await addDeviceData(y,x.deviceID)
            console.log(result)
        });
    
    })
}

//Adds device data to persistent storage
async function addDeviceData(data,deviceID){
    //Create model here
    let result = await DB.addDeviceData(data,deviceID);
    return result;   
}


//gets device data from persistent storage
async function getDeviceStorage(deviceID){
    let result = await DB.getDeviceData(deviceID);
    console.log("We winning", result)
    return result;
}


async function getDeviceConfig(deviceID) {
    let headers = {
        'Authorization': 'FlespiToken pzu9I9BWl8meVol0DUzehLW0FAj21TSejcdR9ECkBOnk0y8rgvtl6gbzEjrt29x9'
    }
    let dataStream
    await fetch(`https://flespi.io/gw/devices/${deviceID}`, { headers: headers }).then(data => {
        return data.json()
    }).then(data => {
        dataStream = data
    })

    return dataStream;
}


async function getConfigData(deviceID) {
    let temp = await getDeviceConfig(deviceID)
    const entries = Object.entries(temp);
    console.log(entries[0][1])
    entries[0][1].forEach(async x => {
        let result = await addConfigData(x)
        // console.log(result)
    });
}


//Adds device data to persistent storage
async function addConfigData(data) {
    let result = await DB.addConfigData(data);
    return result;
}

module.exports = { getDeviceStorage, getAllDeviceData, getConfigData }
