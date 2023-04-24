const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports.checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1]
    console.log('authHeader', authHeader);
    console.log('token', token);
    if (token) {
        jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY, (err, userDetails) => {
            if (err) {
                console.log('err', err);
                return res.status(400).send({ statuCode: "400", message: "Invalid/Expired token" });
            } else {
                console.log('decoded', userDetails);
                req.user = userDetails;
                next();
            }
        });
    } else {
        return res.status(401).send({ statuCode: "401", message: "Invalid Request : Authentication Error" });
    }
};


module.exports.getJwtToken = (req) => {
    const token = jwt.sign({ email: req.email, name: req.name }, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: "12h" })
    return token
};