const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
        type: String,
        unqiue: true
    },
    email: {
        type: String,
        unqiue: true
    },
    password: String,
    status: {
      type: String, 
      enum: ['Pending', 'Active'],
      default: 'Pending'
    },
    confirmationCode: { 
      type: String, 
      unique: true },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;