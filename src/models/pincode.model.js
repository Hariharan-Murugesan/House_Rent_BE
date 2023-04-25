const mongoose = require('mongoose');

const pincodeSchema = mongoose.Schema(
    {
        pincode: {
            type: String,
        },
        state: {
            type: String,
        },
        district: {
            type: String,
        },
        country: {
            type: String,
        },
        latitude: {
            type: String,
        },
        longitude: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const ZonePincodes = mongoose.model('ZonePincodes', pincodeSchema, 'ZonePincodes');
module.exports = ZonePincodes;
