const DB = require('./databaseFunctions')
const fetch = require('node-fetch')
let dataModel = require("../scripts/models/dataModel");
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
        // console.log(x.deviceID)
        let temp =  await getDeviceData(x.deviceID)
        const entries = Object.entries(temp);
        // console.log(entries[0][1])
        entries[0][1].forEach(async y => {
            let result = await addDeviceData(y,x.deviceID)
            // console.log(result)
        });
    
    })
}

//Adds device data to persistent storage
async function addDeviceData(data, deviceID) {
    // console.log(data['position.altitude'])
    function dateAndTime(date) {
        var myDate = new Date(date['timestamp']*1000)
        let modified = myDate.toLocaleString()
        return modified;
    }
    let processData = new dataModel({
        ID: data['device.id'],
        dateAndTime: dateAndTime(data),
        Latitude: data['position.latitude'],
        Longitude: data['position.longitude'],
        Altitude: data['position.altitude'],
        RPM: data['can.engine.rpm'],
        MAF: data['can.maf.air.flow.rate'],
        Speed: data['can.vehicle.speed'],
        IMEI: data['ident'],
        timestamp: data['timestamp']
    })
    let result = await DB.addDeviceData(processData, deviceID);
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
        console.log(result)
    });
}


//Adds device data to persistent storage
async function addConfigData(data) {
    let result = await DB.addConfigData(data);
    return result;
}


async function createNewDevice() {
    //let ident, phone, settings_poll, device_type_id, name, messages_ttl = await dummyDeviceInfo();
    fetch("https://flespi.io/gw/devices", {
        body: JSON.stringify([{
            "configuration": {
                "ident": "357544376624356",
                "phone": "+27123456789",
                "settings_polling": "daily"
            },
            "device_type_id": 745,
            "name": "FMB003",
            "messages_ttl": 31536000
        }]),
        headers: {
            Authorization: "FlespiToken pzu9I9BWl8meVol0DUzehLW0FAj21TSejcdR9ECkBOnk0y8rgvtl6gbzEjrt29x9",
            'Content-Type': 'application/json'
        },
        method: "POST"
    })
    console.log("Device has been created successfully.")
}


// async function dummyDeviceInfo() {
//     let ident = "357544376624355";
//     let phone = "+27123456789";
//     let settings_poll = "daily";
//     let device_type_id = 745;
//     let name = "FMB003";
//     let messages_ttl = 31536000;
//     return {ident, phone, settings_poll, device_type_id, name, messages_ttl}
// }

module.exports = { getDeviceStorage, getAllDeviceData, getConfigData, createNewDevice }
