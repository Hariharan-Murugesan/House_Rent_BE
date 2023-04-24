const { CONSTANT_MSG } = require('../config/constant_messages');
const { houseService } = require('../services');
const { addHouse, updateHouse, deleteHouseById, getAllHouse, getHouseById } = require('../validator/validation');

exports.addHouse = async (req, res) => {
    try {
        await addHouse.validateAsync(req.body);
        const house = await houseService.addHouse(req.body);
        return res.status(house.statusCode).send(house);
    } catch (error) {
        console.log("Error in addHouse API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.getAllHouse = async (req, res) => {
    try {
        await getAllHouse.validateAsync(req.body)
        const house = await houseService.getAllHouse(req.body);
        return res.status(house.statusCode).send(house);
    } catch (error) {
        console.log("Error in getAllHouse API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.updateHouse = async (req, res) => {
    try {
        await updateHouse.validateAsync(req.body);
        const house = await houseService.updateHouse(req.body);
        return res.status(house.statusCode).send(house);
    } catch (error) {
        console.log("Error in updateHouse API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.deleteHouseById = async (req, res) => {
    try {
        await deleteHouseById.validateAsync(req.body);
        const house = await houseService.deleteHouseById(req.body);
        return res.status(house.statusCode).send(house);
    } catch (error) {
        console.log("Error in deleteHouseById API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.getHouseById = async (req, res) => {
    try {
        await getHouseById.validateAsync(req.query);
        const house = await houseService.getHouseById(req.query);
        return res.status(house.statusCode).send(house);
    } catch (error) {
        console.log("Error in getHouseById API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};