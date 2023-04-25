const mongoose = require('mongoose');

const serviceStructure = {
    categoryId: { type: String },
    subCategoryIds: { type: Array },
}

const houseSchema = new mongoose.Schema({
    houseName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Array,
    },
    stayTime: {
        type: String,
        required: true
    },
    stayType: {
        type: String,
        required: true
    },
    facility: {
        guest: {
            type: Number,
            required: true
        },
        bedroom: {
            type: Number,
            required: true
        },
        bed: {
            type: Number,
            required: true
        },
        bathroom: {
            type: Number,
            required: true
        },
    },
    roomService: [serviceStructure],
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
    viewCount: {
        type: Number,
        default: 0
    },
    houseStatus: {
        type: String,
        default: 'UNAPPROVED'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    });

module.exports = mongoose.model('House', houseSchema, 'House');