const mongoose = require('mongoose');

const dataModel = mongoose.model(
    "datamodel",
    new mongoose.Schema({
        configuration: {
            ident: {
                type: String,
                unique: true,
                required: true
            },
            phone: {
                type: String,
                required: true,
            },
            setting_polling: {
                type: String,
                required: true,
                enum: ["never", "once", "daily", "weekly", "monthly"],
                default: "daily"
            }
        },
        device_type_id: {
            type: Number,
            required: true,
            default: 745
        },
        name: {
            type: String,
            required: true
        },
        messages_ttl: {
            type: Number,
            required: true,
            default: 31536000
        },
        // "configuration": {
        //     "ident": "357544376624355",
        //     "phone": "number here",
        //     "settings_polling": "daily"
        // },
        // "device_type_id": 745,
        // "name": "FMB003",
        // "messages_ttl": 31536000
    })
);

module.exports = dataModel;