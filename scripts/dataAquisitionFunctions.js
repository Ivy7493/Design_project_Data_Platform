let DB = require('./databaseFunctions')
let dataModel = require("../scripts/models/dataModel");

async function addData(data) {
    data.map(async function (x) {
        let processData = new dataModel({
            ID: x.ID,
            dateAndTime: x.dateAndTime,
            Latitude: x.Latitude,
            Longitude: x.Longitude,
            Altitude: x.Altitude,
            RPM: x.RPM,
            MAF: x.MAF,
            Speed: x.Speed
        })
        await DB.addData(processData);
    })
    
    return "Done";
}

async function extractData(data) {
    data.map(async function (x) {
        let extractedData = new dataModel({
            ID: x.device.id,
            dateAndTime: x.timestamp,
            Latitude: x.position.latitude,
            Longitude: x.position.longitude,
            Altitude: x.position.altitude,
            RPM: x.can.engine.rpm,
            MAF: x.can.maf.air.flow.rate,
            Speed: x.can.vehicle.speed
        })
        await DB.addData(extractedData);
    })
    return "Done";
}

module.exports = {addData}
