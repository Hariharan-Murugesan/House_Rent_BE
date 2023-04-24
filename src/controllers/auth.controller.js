const Registration = require('../models/register.models');

module.exports.userDetail = async (req, res) => {
    try {
        const data = await Registration.find({ email: req.user.email });
        res.status(200).send({ statusCode: '200', message: "Successfully details fetched by token", data: data });
    } catch (error) {
        console.log(error)
    }
}