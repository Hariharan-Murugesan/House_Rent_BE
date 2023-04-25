const { authService } = require('../services');
const { signInSchema, signUpSchema, signOutSchema, forgotPassword, changePassword, newPasswordByOldPassword,
    socialLogin, refreshToken, becameCurator, becameSeller, checkEmail, changeEmail } = require('../validator/validation')
const Authentication = require("../middleware/authentication");
const { CONSTANT_MSG } = require('../config/constant_messages');

// Register
exports.register = async (req, res) => {
    try {
        await signUpSchema.validateAsync(req.body);
        const user = await authService.createUser(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in Register API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        await signInSchema.validateAsync(req.body);
        let user = await authService.login(req.body);
        if (user.status != 'error') {
            user.token = await Authentication.getJwtToken(user.data);
        }
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in Login API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        await signOutSchema.validateAsync(req.body);
        const user = await authService.logout(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in Logout API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

// Social Register 
exports.socialLogin = async (req, res) => {
    try {
        await socialLogin.validateAsync(req.body);
        const user = await authService.socialLogin(req.body);
        if (user.status != 'error') {
            let token;
            token = await Authentication.getJwtToken(user.data);
            user.token = token;
        }
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in Social Register API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

// ForgotPassword 
exports.forgotPassword = async (req, res) => {
    try {
        await forgotPassword.validateAsync(req.body);
        const user = await authService.forgotPassword(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in Forgot Password API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        await changePassword.validateAsync(req.body);
        const user = await authService.changePassword(req.body);
        if (user.status != 'error') {
            let token;
            if (req.body.isMobileApp) {
                token = await Authentication.getJwtTokenForMbl(user.data);
            } else {
                token = await Authentication.getJwtToken(user.data);
            }
            user.token = token;
        }
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in Change Password API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.newPasswordByOldPassword = async (req, res) => {
    try {
        await newPasswordByOldPassword.validateAsync(req.body);
        const user = await authService.newPasswordByOldPassword(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in newPasswordByOldPassword API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        await refreshToken.validateAsync(req.body);
        const refreshTokenDetails = await authService.refreshToken(req.body);
        return res.status(refreshTokenDetails.statusCode).send(refreshTokenDetails);
    } catch (error) {
        console.log("Error in Refresh Token API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.becameOwner = async (req, res) => {
    try {
        await becameCurator.validateAsync(req.body);
        const user = await authService.becameCurator(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in Became Curator API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.becameTenant = async (req, res) => {
    try {
        await becameSeller.validateAsync(req.body);
        const user = await authService.becameSeller(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in Became Seller API: ", error);
        return res.status(500).send({ statusCode: 500, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

exports.checkEmail = async (req, res) => {
    try {
        await checkEmail.validateAsync(req.body);
        const user = await authService.checkEmail(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in checkEmail API: ", error);
        return res.status(500).send({ statusCode: 500, message: error.message });
    }
};

exports.changeEmail = async (req, res) => {
    try {
        await changeEmail.validateAsync(req.body);
        const user = await authService.changeEmail(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in changeEmail API: ", error);
        return res.status(500).send({ statusCode: 500, message: error.message });
    }
};

exports.confirmEmail = async (req, res) => {
    try {
        //await changeEmail.validateAsync(req.body);
        const user = await authService.confirmEmail(req.query);
        return res.status(user.statusCode).send(user);
    } catch (error) {
        console.log("Error in confirmEmail API: ", error);
        return res.status(500).send({ statusCode: 500, message: error.message });
    }
};