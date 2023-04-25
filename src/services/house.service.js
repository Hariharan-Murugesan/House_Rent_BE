
const { CONSTANT_MSG } = require('../config/constant_messages');
const { House, User } = require('../models')
const ObjectID = require('mongodb').ObjectId;

exports.addHouse = async (details) => {
    try {
        const user = await User.findOne({ _id: ObjectID(details.userId) })
        if (!user) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.SUCCESS,
                message: CONSTANT_MSG.USER.USER_NOT_FOUND
            }
        }
        const oldHouse = await House.findOne({ $and: [{ userId: details.userId }, { pincode: details.pincode }, { space: details.space }, { houseName: details.houseName }] })
        if (oldHouse) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.SUCCESS,
                message: CONSTANT_MSG.HOUSE.HOUSE_ALEADY_ADDED
            }
        }
        const house = new House(details)
        await house.save()
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.HOUSE.HOUSE_ADDED_SUCCESSFULLY
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}

exports.updateHouse = async (details) => {
    try {
        const user = await User.findOne({ _id: ObjectID(details.userId) })
        if (!user) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.SUCCESS,
                message: CONSTANT_MSG.USER.USER_NOT_FOUND
            }
        }
        const oldHouse = await House.findOne({ $and: [{ _id: { $ne: ObjectID(details.houseId) } }, { userId: details.userId }, { pincode: details.pincode }, { space: details.space }, { houseName: details.houseName }] })
        if (oldHouse) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.SUCCESS,
                message: CONSTANT_MSG.HOUSE.HOUSE_ALEADY_ADDED
            }
        }
        await House.updateOne({ _id: ObjectID(details.houseId) }, details);
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.HOUSE.HOUSE_UPDATED_SUCCESSFULLY
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}

exports.deleteHouseById = async (details) => {
    try {
        const house = await House.findOne({ _id: ObjectID(details.houseId), userId: details.userId })
        if (!house) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.HOUSE.HOUSE_NOT_FOUND
            }
        }
        await House.updateOne({ _id: ObjectID(details.houseId), userId: details.userId }, { $set: { isDeleted: true } });
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.HOUSE.HOUSE_DELETED_SUCCESSFULLY
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}

exports.getHouseById = async (details) => {
    try {
        const house = await House.findOne({ _id: ObjectID(details.houseId) })
        if (!house) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.HOUSE.HOUSE_NOT_FOUND
            }
        }
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.HOUSE.HOUSE_DELETED_SUCCESSFULLY,
            data: house
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}

exports.getAllHouse = async (reqQuery) => {
    try {
        const page = parseInt(reqQuery.page);
        const limit = parseInt(reqQuery.limit);
        const skip = (page - 1) * limit;
        let aggregatePipeline = []
        aggregatePipeline.push(
            { $match: { $and: [{ isDeleted: false }, { userId: reqQuery.userId }] } }, { $addFields: { userObjId: { $toObjectId: "$userId" } } },
            { $lookup: { from: "User", localField: "userObjId", foreignField: "_id", pipeline: [{ $project: { name: 1, mobile: 1 } }], as: "userDetails" } },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } }, { $project: { updatedAt: 0, createdAt: 0, __v: 0 } }
        );

        // aggregatePipeline.push({ $sort: { likeCount: -1 } });
        const houses = await House.aggregate(aggregatePipeline).skip(skip).limit(limit);
        const totalCount = await House.find({ isDeleted: false }).count();
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.HOUSE.HOUSE_FETCH_SUCCESSFULLY,
            data: {
                house: houses,
                totalCount: totalCount
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


