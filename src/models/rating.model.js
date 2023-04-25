const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
    {
        tenantId: {
            type: String,
        },
        houseId: {
            type: String,
        },
        clean: {
            type: Number,
        },
        accuracy: {
            type: Number,
        },
        communication: {
            type: Number,
        },
        Location: {
            type: Number,
        },
        checkIn: {
            type: Number,
        },
        value: {
            type: Number,
        },
        review: {
            type: String,
        }, 
    },
    {
        timestamps: true,
    }
);

const ratingsModel = mongoose.model('Rating', ratingSchema, 'Rating');
module.exports = ratingsModel;
