const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
    {
        tenantId: {
            type: String,
        },
        typeId: {
            type: String,
        },
        ratingType: {
            type: String,
        },
        review: {
            type: String,
        },
        rating: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const ratingsModel = mongoose.model('Rating', ratingSchema, 'Rating');
module.exports = ratingsModel;
