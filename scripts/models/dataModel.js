const mongoose = require("mongoose");

const dataModel = mongoose.model(
    "dataModel",
    new mongoose.Schema({
        ID: {
            type: String,
            unique: true
        },
        dateAndTime: {
            type: String,
            unique: true
        },
        Latitude: {
            type: Number,
            required: true
        },
        Longitude: {
            type: Number,
            required: true,
        },
        Altitude: {
            type: Number,
            required: true
        },
        RPM: {
            type: Number,
            required: true,
            //enum: [0],
            default: 0
        },
        MAF: {
            type: Number,
            required: true,
            //enum: [0],
            default: 0
        },
        Speed: {
            type: Number,
            required: true,
            //enum: [0],
            default: 0
        }
    })
);

module.exports = dataModel;