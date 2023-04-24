
const { CONSTANT_MSG } = require('../config/constant_messages');
const { House, User } = require('../models')
const ObjectID = require('mongodb').ObjectId;

exports.getOwnerNameList = async (details) => {
    try {
        const owner = await House.find({}, { _id: 1, name: 1 });
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.OWNER.OWNER_FETCH_SUCCESSFULLY,
            data: owner
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}

exports.getOwnerList = async (details) => {
    try {
        const owner = await User.find({ userRole: "OWNER" });
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.OWNER.OWNER_FETCH_SUCCESSFULLY,
            data: owner
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}

exports.getTenantList = async (details) => {
    try {
        const owner = await User.find({ userRole: "TENANT" });
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.OWNER.OWNER_FETCH_SUCCESSFULLY,
            data: owner
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}

exports.getTenantBookedList = async (details) => {
    try {
        const owner = await House.find({}, { _id: 1, name: 1 });
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.OWNER.OWNER_FETCH_SUCCESSFULLY,
            data: owner
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}