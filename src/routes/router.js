const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const { authController } = require("../controllers")

// Auth 
router.use("/user/register", authController.register);
router.use("/user/login", authController.login);
router.use("/user/logout", authController.logout);
router.use("/user/socialLogin", authController.socialLogin);
router.use("/user/forgotPassword", authController.forgotPassword);

module.exports = router;