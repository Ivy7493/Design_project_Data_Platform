const mongoose = require("mongoose");

const energyModel = mongoose.model(
    "energyModel",
    new mongoose.Schema({
        carID: {
            type: String,
            unique: true
        },
        EnergyConsumption: {
            type: Number,
            required: true
        }
       
    })
);

module.exports = energyModel;