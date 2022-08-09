const mongoose = require("mongoose");

const Driver = mongoose.model(
  "Driver",
  new mongoose.Schema({
    driverID: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        requied: true
    },
    car: {
      type: String,
      required: true
      
    },
    employement: {
        type: String,
        required: true,
        enum: ['employed','fired'],
        default: 'employed'
    }
  })
);

module.exports = Driver;