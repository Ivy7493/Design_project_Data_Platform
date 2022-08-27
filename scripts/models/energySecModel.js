const mongoose = require("mongoose");

const energySecModel = mongoose.model(
    "energySecModel",
    new mongoose.Schema({
        carID: {
            type: String,
            unique: true
        },
        EnergyConsumption: {
            type: Array,
            required: true
        }
       
    })
);

module.exports = energySecModel;