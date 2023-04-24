const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    houseName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    space: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
    }
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('House', houseSchema, 'House')