const mongoose = require('mongoose');

const pincodeSchema = mongoose.Schema(
    {
        pincode: {
            type: Number,
        },
        stateName: {
            type: String,
        },
        district: {
            type: String,
        },
        country: {
            type: String,
        },
        lattitude: {
            type: String,
        },
        longtitude: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const ZonePincodes = mongoose.model('ZonePincodes', pincodeSchema, 'ZonePincodes');
module.exports = ZonePincodes;
