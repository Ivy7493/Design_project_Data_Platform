const mongoose = require("mongoose");

const dataModel = mongoose.model(
    "dataModel",
    new mongoose.Schema({
        Altitude: {
            type: Number,
            required: true
        },
        ID: {
            type: Number,
            unique: true
        },
        IMEI: {
            type: Number,
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
        MAF: {
            type: Number,
            required: false,
            default: 0
        },
        RPM: {
            type: Number,
            required: false,
            default: 0
        },
        Speed: {
            type: Number,
            required: false,
            default: 0
        },
        dateAndTime: {
            type: String,
            required: true
        },
        timestamp: {
            type: Number,
            required: true
        }
    })
);

module.exports = dataModel;