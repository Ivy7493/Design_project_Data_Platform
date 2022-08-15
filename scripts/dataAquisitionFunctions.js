let DB = require('./databaseFunctions')
let dataModel = require("../scripts/models/dataModel");

async function addData(data) {
    data.map(async function (x) {
        let processData = new dataModel({
            ID: x.ID,
            Date: x.Date,
            Time: x.Time,
            Latitude: x.Latitude,
            Longitude: x.Longitude,
            Altitude: x.Altitude,
            Speed: x.Speed,
            Heading: x.Heading,
            SignalQuality: x.SignalQuality,
            NumberofSatalitesConnected: x.NumberofSatalitesConnected,
            XAxisAcceleration: x.XAxisAcceleration,
            YAxisAcceleration: x.YAxisAcceleration,
            ZAxisAcceleration: x.ZAxisAcceleration,
            PropultionWork: x.PropultionWork,
            BrakingWork: x.BrakingWork,
            OffloadWork: x.OffloadWork,
            EnergyConsumption: x.EnergyConsumption,
            Displacement: x.Displacement,
            SlopeAngle: x.SlopeAngle
        })
        await DB.addData(processData);
    })
    
    return "Done";
}

module.exports = {addData}
