const express = require("express");
const router = express.Router();
const multer = require('multer');

const authentication = require("../middleware/authentication");
const { authController, adminController, houseController } = require("../controllers")
const { singleFileUpload, multiFileUpload, readS3File } = require("../config/fileUpload");

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024
    }
})

// Auth 
router.post("/user/register", authController.register);
router.post("/user/login", authController.login);
router.post("/user/logout", authController.logout);
router.post("/user/socialLogin", authController.socialLogin);
router.post("/user/forgotPassword", authController.forgotPassword);
router.post("/user/refreshToken", authController.refreshToken);
router.post("/user/becameOwner", authController.becameOwner);
router.post("/user/becameTenant", authController.becameTenant);

// House
router.post("/house/addHouse", authentication.checkJwtToken, houseController.addHouse);
router.post("/house/updateHouse", authentication.checkJwtToken, houseController.updateHouse);
router.delete("/house/deleteHouseById", authentication.checkJwtToken, houseController.deleteHouseById);
router.get("/house/getHouseById", authentication.checkJwtToken, houseController.getHouseById);
router.post("/house/getAllHouse", authentication.checkJwtToken, houseController.getAllHouse);

// Admin
router.use("/admin/approveByAdmin", authentication.checkJwtToken, adminController.approveByAdmin);
router.use("/admin/getOwnerNameList", authentication.checkJwtToken, adminController.getOwnerNameList);
router.use("/admin/getOwnerList", authentication.checkJwtToken, adminController.getOwnerList);
router.use("/admin/getTenantList", authentication.checkJwtToken, adminController.getTenantList);
router.use("/admin/getTenantBookedList", authentication.checkJwtToken, adminController.getTenantBookedList);

// S3
router.post('/multipleUpload', multerMid.array('file'), multiFileUpload);
router.post('/singleUpload', multerMid.single('file'), singleFileUpload);
router.get('/readS3File', readS3File);


module.exports = router;