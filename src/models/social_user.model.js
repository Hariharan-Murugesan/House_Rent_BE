const mongoose = require('mongoose');

const socialUserSchema = mongoose.Schema(
    {
        name: {
            type: String,          
        },
        userId:{
            type: String,
        },        
        mobile: {
            type: String,            
        },
        email: {
            type: String,           
        },     
        userRole: {
            type: String,
        },
        profileImage: {
            type: String,
        },
        provider: {
            type: String,
        },
        signupType: {
            type: String,
        },
        socialToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Social_User = mongoose.model('Social_User', socialUserSchema, 'Social_User');
module.exports = Social_User;
