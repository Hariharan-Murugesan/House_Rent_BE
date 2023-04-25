
const { CONSTANT_MSG } = require('../config/constant_messages');
const { House, User } = require('../models')
const ObjectID = require('mongodb').ObjectId;

exports.approveByAdmin = async (details) => {
    try {
        if (details.userId) {
            const user = await User.find({ _id: ObjectID(details.userId) }, { _id: 1 });
            if (!user) {
                return {
                    statusCode: 400,
                    status: CONSTANT_MSG.STATUS.ERROR,
                    message: CONSTANT_MSG.USER.USER_NOT_FOUND,
                }
            }
            await User.updateOne({ _id: ObjectID(details.userId) }, details);
            return {
                statusCode: 200,
                status: CONSTANT_MSG.STATUS.SUCCESS,
                message: details.status === 'APPROVED' ? CONSTANT_MSG.USER.USER_APPROVED : CONSTANT_MSG.USER.USER_REJECTED,
            }
        }
        else {
            const house = await House.find({ _id: ObjectID(details.houseId) }, { _id: 1 });
            if (!house) {
                return {
                    statusCode: 400,
                    status: CONSTANT_MSG.STATUS.ERROR,
                    message: CONSTANT_MSG.HOUSE.HOUSE_NOT_FOUND,
                }
            }
            await House.updateOne({ _id: ObjectID(details.houseId) }, details);
            return {
                statusCode: 200,
                status: CONSTANT_MSG.STATUS.SUCCESS,
                message: details.status === 'APPROVED' ? CONSTANT_MSG.HOUSE.HOUSE_APPROVED : CONSTANT_MSG.HOUSE.HOUSE_REJECTED,
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}

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