const mongoose = require("mongoose");

const dataModel = mongoose.model(
    "dataModel",
    new mongoose.Schema({
        ID: {
            type: Number,
            unique: true
        },
        Date: {
            type: String,
            unique: true
        },
        Time: {
            type: String,
            requied: true
        },
        Latitude: {
            type: Number,
            required: true
        },
        Longitude: {
            type: Number,
            required: true,
            // enum: ['In-use', 'Retired'],
            // default: 'In-use'
        },
        Altitude: {
            type: Number,
            required: true
        },
        Speed: {
            type: Number,
            required: true
        },
        Heading: {
            type: Number,
            required: true
        },
        SignalQuality: {
            type: Number,
            required: true
        },
        NumberofSatalitesConnected: {
            type: Number,
            required: true
        },
        XAxisAcceleration: {
            type: Number,
            required: true
        },
        YAxisAcceleration: {
            type: Number,
            required: true
        },
        ZAxisAcceleration: {
            type: Number,
            required: true
        },
        PropulsionWork: {
            type: Number,
            required: true
        },
        BrakingWork: {
            type: Number,
            required: true
        },
        OffloadWork: {
            type: Number,
            required: true
        },
        EnergyConsumption: {
            type: Number,
            required: true
        },
        Displacement: {
            type: Number,
            required: true
        },
        SlopeAngle: {
            type: Number,
            required: true
        }
    })
);

module.exports = dataModel;