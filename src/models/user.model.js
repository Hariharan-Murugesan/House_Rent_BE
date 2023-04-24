const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userRole: {
        type: Array,
        required: true
    },
    userStatus: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true
    },
    isSocialLogin: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Owner', ownerSchema, 'Owner')