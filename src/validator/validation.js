const joi = require('joi');

module.exports.signUpSchema =  joi.object({ 
    name: joi.string().min(3).max(30).required(),
    email: joi.string().trim().email().required(), 
    password: joi.string().min(3).max(16).required(),
    confirmPassword: joi.any().valid(joi.ref('password')).required()
});

module.exports.signInSchema = joi.object({ 
    email: joi.string().trim().email().required(), 
    password: joi.string().min(3).max(16).required(),
});
