const express = require("express");
const path = require("path");
const { join } = require("path");
const dataRouter = express.Router();
const dataService = require("../scripts/dataAquisitionFunctions")

dataRouter.post("/", function (req, res) {
    console.log(req.body)
    try {
        dataService.addData(req.body).then(status => {
            console.log(status)
            res.json("Done")
        })
    }
    catch (e){console.log(e)}
});

module.exports = dataRouter;