const joi = require('joi');
const joiObjectId = require('joi-objectid')(joi);

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

module.exports.addHouse = joi.object({
    userId: joiObjectId().required(),
    houseName: joi.string().required(),
    description: joi.string().allow(''),
    image: joi.array().items(joi.string()).required(),
    stayType: joi.string().valid('SHERED', 'PRIVATE').required(),
    stayTime: joi.string().valid('DAY', 'NIGHT', 'FULLDAY').required(),
    facility: joi.object({
        guest: joi.number().min(1).required(),
        bedroom: joi.number().min(1).required(),
        bed: joi.number().required(),
        bathroom: joi.number().min(1).required()
    }).required(),
    roomService: joi.array().items(joi.object({
        categoryId: joiObjectId().required(),
        subCategoryId: joi.array().required()
    })),
    price: joi.number().min(1).required(),
    space: joi.string().required(),
    address1: joi.string().min(3).required(),
    address2: joi.string().min(3).required(),
    district: joi.string().required(),
    state: joi.string().required(),
    country: joi.string().required(),
    pincode: joi.string().max(6).required(),
    state: joi.string().required(),
    latitude: joi.string().required(),
    longitude: joi.string().required(),
    texPercent: joi.number().allow(''),
    hostLanguage: joi.array().items(joi.string()).required(),
    propertyType: joi.string().valid('HOUSE', 'FLAT', 'GUEST HOUSE', 'HOTEL').required(),
});

module.exports.updateHouse = joi.object({
    houseId: joiObjectId().required(),
    userId: joiObjectId().required(),
    houseName: joi.string().required(),
    description: joi.string().allow(''),
    image: joi.array().items(joi.string()).required(),
    stayType: joi.string().valid('SHERED', 'PRIVATE').required(),
    stayTime: joi.string().valid('DAY', 'NIGHT', 'FULLDAY').required(),
    facility: joi.object({
        guest: joi.number().min(1).required(),
        bedroom: joi.number().min(1).required(),
        bed: joi.number().required(),
        bathroom: joi.number().min(1).required()
    }).required(),
    roomService: joi.array().items(joi.object({
        categoryId: joiObjectId().required(),
        subCategoryId: joi.array().required()
    })),
    price: joi.number().min(1).required(),
    space: joi.string().required(),
    address1: joi.string().min(3).required(),
    address2: joi.string().min(3).required(),
    district: joi.string().required(),
    state: joi.string().required(),
    country: joi.string().required(),
    pincode: joi.string().max(6).required(),
    state: joi.string().required(),
    latitude: joi.string().required(),
    longitude: joi.string().required(),
    texPercent: joi.number().allow(''),
    hostLanguage: joi.array().items(joi.string()).required(),
    propertyType: joi.string().valid('HOUSE', 'FLAT', 'GUEST HOUSE', 'HOTEL').required(),
});

module.exports.deleteHouseById = joi.object({
    houseId: joiObjectId().required()
});

module.exports.getAllHouse = joi.object({
    userId: joiObjectId().required(),
    limit: joi.number().min(1).required(),
    page: joi.number().min(1).required(),
});

module.exports.getHouseById = joi.object({
    houseId: joiObjectId().required(),
});

module.exports.readS3File = joi.object({
    key: joi.string().required(),
});

module.exports.approveByAdmin = joi.object({
    type: joi.string().valid('OWNER', 'HOUSE').required(),
    userId: joi.when('type', {
        is: joi.string().valid('OWNER'),
        then: joiObjectId().required(),
        otherwise: joi.valid(null),
    }),
    houseId: joi.when('type', {
        is: joi.string().valid('HOUSE'),
        then: joiObjectId().required(),
        otherwise: joi.valid(null),
    }),
    status: joi.string().valid('APPROVED', 'REJECTED').required(),
});

module.exports.getPincode = joi.object({
    pincode: joi.string().min(6).required(),
});