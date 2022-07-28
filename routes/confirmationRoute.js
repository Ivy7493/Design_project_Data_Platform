const express = require("express");
const path = require("path");
const { join } = require("path");
let AuthService = require('../scripts/AuthenticationFunctions')
const confirmationRouter = express.Router();

confirmationRouter.get("/:confirmationCode?", function (req, res) {
    console.log("Poggers",req.query.confirmationCode)
    AuthService.confirmNewUser(req.query.confirmationCode).then(data =>{
        console.log("Status: ", data)
        res.sendFile(path.join(__dirname, "../views/index.html"));
    })
    
});

module.exports = confirmationRouter;