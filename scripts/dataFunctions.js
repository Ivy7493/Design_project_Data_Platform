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
        console.log(result)
    });
}


//Adds device data to persistent storage
async function addConfigData(data) {
    let result = await DB.addConfigData(data);
    return result;
}


async function createNewDevice() {
    // //curl -X POST  --header 'Authorization: FlespiToken pzu9I9BWl8meVol0DUzehLW0FAj21TSejcdR9ECkBOnk0y8rgvtl6gbzEjrt29x9'  -d '[{"configuration":{"ident":"357544376624356"},"device_type_id":745,"messages_ttl":31536000,"messages_rotate":0}]' 'https://flespi.io/gw/devices?fields=device_type_id%2Cname%2Cprotocol_id%2Cconfiguration'
    // let header = {
    //     'Authorization': 'FlespiToken pzu9I9BWl8meVol0DUzehLW0FAj21TSejcdR9ECkBOnk0y8rgvtl6gbzEjrt29x9'
    // }
    // await fetch('https://flespi.io/gw/devices?fields=', {
    //     method: 'post',
    //     headers: { header },
    //     body: JSON.stringify({
    //         "configuration": {
    //             "ident": "357544376624356",
    //             "phone": "number here",
    //             "settings_polling": "daily"
    //         },
    //         "device_type_id": 745,
    //         "name": "FMB003",
    //         "messages_ttl": 31536000
    //     })
    // })
}


async function deviceInformation() {
    // let ident = "357544376624355";
    // let phone = "number here";
}

module.exports = { getDeviceStorage, getAllDeviceData, getConfigData, createNewDevice }
