const joi = require('joi');
const joiObjectId = require('joi-objectid')(joi)

module.exports.signUpSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().max(75).required(),
    mobile: joi.string().min(10),
    password: joi.string().min(6).max(30).required(),
    confirmPassword: joi.string().min(6).max(30).required(),
    userRole: joi.string().required().valid('OWNER', 'TENANT').required(),    
});

module.exports.signInSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().min(6).max(30).required()
});

module.exports.signOutSchema = joi.object({
    token: joi.string().required()
});

module.exports.forgotPassword = joi.object({
    username: joi.string().required(),
});

module.exports.socialLogin = joi.object({
    mobile: joi.string().min(10),
    email: joi.string().max(75),
    name: joi.string().required(),
    userRole: joi.string().valid('OWNER', 'TENANT')    
});

module.exports.refreshToken = joi.object({
    userId: joi.string().required(),
    token: joi.string().required(),
});

module.exports.becameOwner = joi.object({
    userId: joiObjectId().required(),
});

module.exports.becameTenant = joi.object({
    userId: joiObjectId().required(),
});

module.exports.changePassword = joi.object({
    username: joi.string().required(),
    password: joi.string().min(6).max(30).required(),
    confirmPassword: joi.any().valid(joi.ref('password'))
});

module.exports.newPasswordByOldPassword = joi.object({
    userId: joi.string().required(),
    oldPassword: joi.string().min(6).max(30).required(),
    password: joi.string().min(6).max(30).invalid(joi.ref('oldPassword')).required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required()
});

module.exports.checkEmail = joi.object({
    userId: joi.string().required(),
    email: joi.string().required()
});

module.exports.changeEmail = joi.object({
    userId: joi.string().required(),
    oldEmail: joi.string().required(),
    email: joi.string().invalid(joi.ref('oldEmail')).required(),
    confirmEmail: joi.string().valid(joi.ref('email')).required()
});