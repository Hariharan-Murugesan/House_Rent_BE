const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const { authController, adminController, houseController } = require("../controllers")

// Auth 
router.use("/user/register", authController.register);
router.use("/user/login", authController.login);
router.use("/user/logout", authController.logout);
router.use("/user/socialLogin", authController.socialLogin);
router.use("/user/forgotPassword", authController.forgotPassword);

// House
router.use("/house/addHouse", authentication.checkJwtToken, houseController.addHouse);
router.use("/house/updateHouse", authentication.checkJwtToken, houseController.updateHouse);
router.use("/house/deleteHouseById", authentication.checkJwtToken, houseController.deleteHouseById);
router.use("/house/getHouseById", authentication.checkJwtToken, houseController.getHouseById);
router.use("/house/getAllHouse", authentication.checkJwtToken, houseController.getAllHouse);

// House
router.use("/admin/getOwnerNameList", authentication.checkJwtToken, adminController.getOwnerNameList);
router.use("/admin/getOwnerList", authentication.checkJwtToken, adminController.getOwnerList);
router.use("/admin/getTenantList", authentication.checkJwtToken, adminController.getTenantList);
router.use("/admin/getTenantBookedList", authentication.checkJwtToken, adminController.getTenantBookedList);

module.exports = router;