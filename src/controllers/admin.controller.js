const { CONSTANT_MSG } = require('../config/constant_messages');
const { adminService } = require('../services');
const { approveByAdmin, getPincode } = require('../validator/validation');

exports.getCategory = async (req, res) => {
    try {
        const category = await adminService.getCategory(req.body);
        return res.status(category.statusCode).send(category);
    } catch (error) {
        console.log("Error in getCategory API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.approveByAdmin = async (req, res) => {
    try {
        await approveByAdmin.validateAsync(req.body);
        const approve = await adminService.approveByAdmin(req.body);
        return res.status(approve.statusCode).send(approve);
    } catch (error) {
        console.log("Error in approveByAdmin API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

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
        const tenantList = await adminService.getTenantList(req.body);
        return res.status(tenantList.statusCode).send(tenantList);
    } catch (error) {
        console.log("Error in getTenantList API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.getTenantBookedList = async (req, res) => {
    try {
        const tenantList = await adminService.getTenantBookedList(req.body);
        return res.status(tenantList.statusCode).send(tenantList);
    } catch (error) {
        console.log("Error in getTenantList API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.getPincode = async (req, res) => {
    try {
        await getPincode.validateAsync(req.body)
        const pincode = await adminService.getPincode(req.body);
        return res.status(pincode.statusCode).send(pincode)
    } catch (error) {
        console.log("Error in Get Pincode API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};