const { CONSTANT_MSG } = require('../config/constant_messages');
const { adminService } = require('../services');
const { addHouse, updateHouse, deleteHouseById, getAllHouse, getHouseById } = require('../validator/validation');

exports.getOwnerNameList = async (req, res) => {
    try {
        const ownerList = await adminService.getOwnerNameList(req.body);
        return res.status(ownerList.statusCode).send(ownerList);
    } catch (error) {
        console.log("Error in getOwnerNameList API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.getOwnerList = async (req, res) => {
    try {
        const ownerList = await adminService.getOwnerList(req.body);
        return res.status(ownerList.statusCode).send(ownerList);
    } catch (error) {
        console.log("Error in getOwnerList API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.getTenantList = async (req, res) => {
    try {
        const ownerList = await adminService.getTenantList(req.body);
        return res.status(ownerList.statusCode).send(ownerList);
    } catch (error) {
        console.log("Error in getTenantList API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.getTenantBookedList = async (req, res) => {
    try {
        const ownerList = await adminService.getTenantBookedList(req.body);
        return res.status(ownerList.statusCode).send(ownerList);
    } catch (error) {
        console.log("Error in getTenantList API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};
