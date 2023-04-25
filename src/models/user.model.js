const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        default: false
    },
    isSocialLogin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema, 'User')