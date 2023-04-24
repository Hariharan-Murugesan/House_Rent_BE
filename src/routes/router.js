const express = require("express");
const router = express.Router();
const User = require("../controllers/user.controller");
const authentication = require("../middleware/authentication");
const authController = require("../controllers/auth.controller")

router.use("/user", User);  //with express 
router.get("/userDetails", authentication.checkJwtToken, authController.userDetail); //normal function


module.exports = router;