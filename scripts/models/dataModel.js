const mongoose = require("mongoose");

const dataModel = mongoose.model(
    "dataModel",
    new mongoose.Schema({
        ID: {
            type: Number,
            unique: true
        },
        dateAndTime: {
            type: String,
            required: true
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
            required: false,
            //enum: [0],
            default: 0
        },
        MAF: {
            type: Number,
            required: false,
            //enum: [0],
            default: 0
        },
        Speed: {
            type: Number,
            required: false,
            //enum: [0],
            default: 0
        },
        IMEI: {
            type: Number,
            required: true
        },
        timestamp: {
            type: Number,
            required: true
        }
    })
);

module.exports = dataModel;