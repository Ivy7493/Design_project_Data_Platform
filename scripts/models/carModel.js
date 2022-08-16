const mongoose = require("mongoose");

const Car = mongoose.model(
  "Car",
  new mongoose.Schema({
    carID: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        unique: true
    },
    mass: {
        type: Number,
        requied: true
    },
    area: {
      type: Number,
      required: true
      
    },
    fuelType: {
      type: Number,
      required: true
    },
    operation: {
        type: String,
        required: true,
        enum: ['In-use','Retired'],
        default: 'In-use'
    }
  })
);

module.exports = Car;