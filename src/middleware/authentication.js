const jwt = require('jsonwebtoken');
const { Token } = require('../models');
require('dotenv').config()

module.exports.checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ statuCode: "401", message: "Invalid Request : Authentication Error" });
    }
    const token = authHeader.split(' ')[1]
    if (token) {
        jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY, (err, userDetails) => {
            if (err) {
                console.log('err', err);
                return res.status(400).send({ statuCode: "400", message: "Invalid/Expired token" });
            } else {
                req.user = userDetails;
                next();
            }
        });
    } else {
        return res.status(401).send({ statuCode: "401", message: "Invalid Request : Authentication Error" });
    }
};


module.exports.getJwtToken = async (req) => {
    const token = jwt.sign({ email: req.email, userRole: req.userRole, mobile: req.mobile, userId: req._id }, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: "12h" });
    const Obj = {
        token: token,
        userId: req._id
    }
    const tokenSave = Token(Obj);
    await tokenSave.save();
    return token;
};