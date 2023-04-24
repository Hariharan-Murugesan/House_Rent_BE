const { User, Social_User, Token } = require('../models');
const bcrypt = require('bcryptjs');
const { CONSTANT_MSG } = require('../config/constant_messages');
const ObjectID = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
require('dotenv').config()

// Register User
exports.createUser = async (reqBody) => {
    try {
        let user = User(reqBody)
        const hashedpassword = reqBody.password ? await bcrypt.hash(reqBody.password, 5) : '';

        if (reqBody.mobile && await User.findOne({ mobile: reqBody.mobile })) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.EMAIL.MOBILENO_EXISTING
            };
        }

        if (reqBody.email != null && await User.findOne({ email: reqBody.email })) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.EMAIL.EMAIL_EXISTING
            };
        }

        reqBody.userStatus = reqBody.userRole === 'OWNER' ? 'UNAPPROVED' : 'APPROVED';
        reqBody.password = hashedpassword;
        user = User(reqBody);
        await user.save();

        const userDetails = await User.findOne({ _id: user._id }, { _id: 1, mobile: 1, email: 1, name: 1, userRole: 1, isVerified: 1 })
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.AUTH.RESIGTER_SUCCESSFULLY,
            data: userDetails
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

// Login
exports.login = async (reqBody) => {
    try {
        let user = await User.findOne({ $or: [{ mobile: reqBody.username }, { email: reqBody.username }] }, { createdAt: 1, mobile: 1, email: 1, name: 1, userRole: 1, isVerified: 1, isSocialLogin: 1, userStatus: 1, password: 1 })
        if (!user) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.AUTH.USER_NOT_REGISTED
            };
        }
        if (user.isSocialLogin == true && !user.password) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.AUTH.USER_REGISTERED_BY_SOCIAL_LOGIN
            };
        }
        if (!user || !(await bcrypt.compare(reqBody.password, user.password))) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.AUTH.INCORRECT_USERNAME_OR_PASSWORD
            };
        }
        const userDetails = await User.findOne({ $or: [{ mobile: reqBody.username }, { email: reqBody.username }] },
            {
                password: 0,
                updatedAt: 0,
                __v: 0
            },
        );

        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.AUTH.LOGIN_SUCCESSFULLY,
            data: userDetails
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

// Social Register
exports.socialLogin = async (reqBody) => {
    try {
        let user = null;
        let loginCreds = {
            email: reqBody.email,
        };
        user = await User.find({ email: reqBody.email }, { password: 0, mobileOtp: 0, updatedAt: 0, __v: 0 });

        if (user.length != 0 && await Social_User.findOne(loginCreds)) {
            user = user[0]
            return {
                statusCode: 200,
                status: CONSTANT_MSG.STATUS.SUCCESS,
                message: CONSTANT_MSG.AUTH.LOGIN_SUCCESSFULLY,
                data: user
            };
        }

        else if (user.length === 0) {
            if (!reqBody.userRole) {
                let obj = {
                    isUserRole: false
                }
                return {
                    statusCode: 400,
                    status: CONSTANT_MSG.STATUS.ERROR,
                    message: CONSTANT_MSG.AUTH.USERROLE_NEEDED,
                    data: obj
                };
            }
            let obj = {
                isVerified: true,
                mobile: reqBody.mobile,
                email: reqBody.email,
                name: reqBody.name,
                userRole: reqBody.userRole,
                isSocialLogin: true
            }
            if (reqBody.userRole.includes("OWNER")) {
                obj.isApproved = false
            }

            obj.userStatus = reqBody.userRole.includes("OWNER") ? 'UNAPPROVED' : 'APPROVED'
            user = User(obj)
            user = await user.save()
            let social_user = Social_User(reqBody)
            await social_user.save()
            user = user[0]
        }
        reqBody.userId = user[0]._id.toString()
        let social_user = Social_User(reqBody)
        await social_user.save()
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.AUTH.RESIGTER_SUCCESSFULLY,
            data: user
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

// Forgot Password
exports.forgotPassword = async (reqBody) => {
    try {
        let user = await User.findOne({ $or: [{ mobile: reqBody.username }, { email: reqBody.username }] })
        if (!user) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.USER.USER_NOT_FOUND
            };
        }
        const otp = Math.floor(100000 + Math.random() * 900000)
        if (reqBody.username) {
            await User.updateOne({ _id: user._id }, { mobileOtp: otp })
            const mobileNumber = reqBody.username
            await constants.sendSMS('OTP_SEND', { mobileNumber, otp });
            user = await User.findOne({ mobile: reqBody.username }, { mobile: 1, email: 1, _id: 1 })
        }
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.OTP.OTP_SEND_SUCCESSFULLY,
            data: user
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

// Change Password
exports.changePassword = async (reqBody) => {
    try {
        let user = await User.findOne({ $or: [{ mobile: reqBody.username }, { email: reqBody.username }] })
        const hashedpassword = await bcrypt.hash(reqBody.password, 5)
        if (!user) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.AUTH.INCORRECT_USERNAME_OR_PASSWORD
            };
        }
        if ((await bcrypt.compare(reqBody.password, user.password))) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.AUTH.PREVIOUS_PASSWORD
            };
        }
        let additionalSellerDetails = {
            password: hashedpassword.toString()
        }
        Object.assign(user, additionalSellerDetails);
        await user.save();
        user = user.userRole.includes("SELLER") ? await User.findOne({ _id: user.id }, { mobile: 1, email: 1, name: 1, userRole: 1, isVerified: 1, isApproved: 1, isDocVerified: 1, isSocialLogin: 1, id: 1, userStatus: 1 }) : await Buyer.findOne({ _id: user.id }, { mobile: 1, email: 1, name: 1, userRole: 1, isVerified: 1, isSocialLogin: 1, _id: 1 })

        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.AUTH.PASSWORD_CHANGED_SUCCESSFULLY,
            data: user
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

exports.newPasswordByOldPassword = async (reqBody) => {
    try {
        let user = await User.findOne({ _id: ObjectID(reqBody.userId) })
        const hashedpassword = await bcrypt.hash(reqBody.password, 5)
        if (!user) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.AUTH.INCORRECT_USERNAME_OR_PASSWORD
            };
        }
        if (!(await bcrypt.compare(reqBody.oldPassword, user.password))) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.AUTH.PREVIOUS_PASSWORD_NOT_MATCHED
            };
        }
        let additionalSellerDetails = {
            password: hashedpassword.toString()
        }
        Object.assign(user, additionalSellerDetails);
        await user.save();

        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.AUTH.PASSWORD_CHANGED_SUCCESSFULLY,
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

//Logout
exports.logout = async (logoutDetails) => {
    try {
        await Token.deleteOne({ token: logoutDetails.token });
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.AUTH.LOGOUT_SUCCESSFULLY
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

exports.refreshToken = async (refreshToken) => {
    try {
        const userTokenDetailsArray = await User.aggregate([
            { $project: { userId: { $toString: "$_id" }, name: 1, email: 1, mobile: 1, userRole: 1 } },
            {
                $lookup: {
                    from: 'Token',
                    localField: "userId",
                    foreignField: 'userId',
                    pipeline: [{ $match: { token: refreshToken.token } },
                    { $project: { token: 1 } }],
                    as: 'tokenDetails'
                }
            }, { $unwind: '$tokenDetails' }, { $match: { userId: refreshToken.userId } }
        ]).limit(1);
        if (!userTokenDetailsArray.length) {
            return {
                statusCode: 401,
                message: CONSTANT_MSG.ERROR_MSG.UNAUTHORIZED_ERROR,
                data: { isLogout: true }
            }
        }
        const userTokenDetails = userTokenDetailsArray[0];
        const token = jwt.sign({ email: userTokenDetails.email, userRole: userTokenDetails.userRole, mobile: userTokenDetails.mobile, userId: userTokenDetails._id }, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: "12h" })
        await Token.updateOne({ "_id": userTokenDetails.tokenDetails._id.toString() }, { token: token });
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.AUTH.TOKEN_REFRESHED_SUCCESSFULLY,
            token: token
        };
    } catch (error) {
        console.log("error", error);
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

exports.becameOwner = async (reqBody) => {
    try {
        let user = await User.findOne({ _id: ObjectID(reqBody.userId) })
        if (user.userRole.includes("CURATOR")) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.AUTH.CURATOR_ALREADY_REGISTERED,
            }
        }
        let shopDetail = {
            curatorId: user.id,
            businessEmail: user.email,
            businessNo: user.mobile
        }
        let shop = CuratorShop(shopDetail)
        await shop.save()
        user.userRole.push("CURATOR")
        const referralDetails = await Referral.find({ referredUserId: user.id });
        const referralCuratorDetails = referralDetails.length ? referralDetails.filter(item => (item.referredUserRole == 'CURATOR')) : [];
        if (!referralCuratorDetails.length && referralDetails.length) {
            referralCodePayload = {
                referrerId: referralDetails[0].referrerId,
                referralCode: referralDetails[0].referralCode,
                referredUserId: user.id,
                referredUserRole: "CURATOR"
            }
            const referralCodeModel = new Referral(referralCodePayload)
            referralCodeModel.save();
        }

        if (user.email != null) {
            const emailObj = {
                email: user.email,
                location: 'curator',
                template: EMAIL.CURATOR_EMAIL_TEMPLATE.REGISTEREDNOTIFY,
                subject: EMAIL.CURATOR_EMAIL_SUBJECT.REGISTEREDNOTIFY,
                data: {
                    sellerName: user.name
                }
            }
            await email.sendEmail(emailObj)
        }
        if (user.mobile != null) {
            const mobileNumber = user.mobile
            const curatorName = user.name
            await constants.sendSMS('CURATOR_REGISTERED', { curatorName, mobileNumber });
        }
        await User.updateOne({ _id: ObjectID(user.id) }, user)
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.AUTH.BECAME_CURATOR,
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

exports.becameTenant = async (reqBody) => {
    try {
        let user = await User.findOne({ _id: ObjectID(reqBody.userId) })
        if (user.userRole.includes("SELLER")) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.AUTH.SELLER_ALREADY_REGISTERED,
            }
        }
        let shopDetail = {
            sellerId: user.id,
            businessEmail: user.email,
            businessNo: user.mobile
        }
        let shop = Shop(shopDetail)
        await shop.save()
        user.userRole.push("SELLER")

        const referralDetails = await Referral.find({ referredUserId: user.id })
        const referralCuratorDetails = referralDetails.length ? referralDetails.filter(item => (item.referredUserRole == 'SELLER')) : [];
        if (!referralCuratorDetails.length && referralDetails.length) {
            referralCodePayload = {
                referrerId: referralDetails[0].referrerId,
                referralCode: referralDetails[0].referralCode,
                referredUserId: user.id,
                referredUserRole: "SELLER"
            }
            const referralCodeModel = new Referral(referralCodePayload)
            referralCodeModel.save();
        }

        if (user.email != null) {
            const emailObj = {
                email: user.email,
                location: 'seller',
                template: EMAIL.SELLER_EMAIL_TEMPLATE.REGISTEREDNOTIFY,
                subject: EMAIL.SELLER_EMAIL_SUBJECT.REGISTEREDNOTIFY,
                data: {
                    sellerName: user.name
                }
            }
            await email.sendEmail(emailObj)
        }
        if (user.mobile != null) {
            const mobileNumber = user.mobile
            const sellerName = user.name
            await constants.sendSMS('RESGISTERED_SUCCESSFULLY', { sellerName, mobileNumber });
        }
        await User.updateOne({ _id: ObjectID(user.id) }, user)
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.AUTH.BECAME_SELLER,
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message,
        };
    }
};

exports.checkEmail = async (reqBody) => {
    try {
        const user = await User.findOne({ email: reqBody.email, "_id": { $ne: ObjectID(reqBody.userId) } })
        const shop = await Shop.findOne({ businessEmail: reqBody.email, "sellerId": { $ne: reqBody.userId } })
        const curatorShop = await CuratorShop.findOne({ businessEmail: reqBody.email, "curatorId": { $ne: reqBody.userId } })
        if (user || shop || curatorShop) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.SHOP.EMAIL_ALREADY_EXIST
            };
        }
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.EMAIL.EMAIL_NOT_FOUND,
        };

    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}

exports.changeEmail = async (reqBody) => {
    try {
        const user = await User.findOne({ "_id": ObjectID(reqBody.userId) })
        if (!user) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.USER.USER_NOT_FOUND
            };
        }
        if (user.email != reqBody.oldEmail) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.EMAIL.PREVIOUS_EMAIL_NOT_MATCHED
            };
        }
        const Token = jwt.sign({ email: reqBody.email, userId: reqBody.userId }, 'unipickclaritaz123', { expiresIn: '300s' });
        const urlLink = process.env.FE_API_LINK + 'confirmEmail?userId=' + reqBody.userId + '&email=' + reqBody.email + '&token=' + Token;
        if (reqBody.email != null) {
            const emailObj = {
                email: reqBody.email,
                location: 'buyer',
                template: EMAIL.BUYER_EMAIL_TEMPLATE.EMAILVERIFYNOTIFY,
                subject: EMAIL.BUYER_EMAIL_SUBJECT.EMAILVERIFYNOTIFY,
                data: {
                    sellerName: user.name,
                    emailVerifyAPI: urlLink
                }
            }
            await email.sendEmail(emailObj)
        }
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.EMAIL.EMAIL_VERIFIED_BY_EMAIL,
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}

exports.confirmEmail = async (reqBody) => {
    try {
        const user = await User.findOne({ "_id": ObjectID(reqBody.userId) })
        if (!user) {
            return {
                statusCode: 400,
                status: CONSTANT_MSG.STATUS.ERROR,
                message: CONSTANT_MSG.USER.USER_NOT_FOUND
            };
        }
        const email = await EmailToken.findOne({ "token": reqBody.token, "userId": reqBody.userId, "email": reqBody.email })
        if (email) {
            return {
                statusCode: 401,
                message: CONSTANT_MSG.TOKEN.TOKEN_EXPIRED
            };
        }
        if (user.userRole.includes("SELLER")) {
            await Shop.updateOne({ "sellerId": reqBody.userId }, { businessEmail: reqBody.email })
        }
        if (user.userRole.includes("CURATOR")) {
            await CuratorShop.updateOne({ "curatorId": reqBody.userId }, { businessEmail: reqBody.email })
        }
        await User.updateOne({ "_id": ObjectID(reqBody.userId) }, { email: reqBody.email })

        let emailToken = EmailToken(reqBody)
        await emailToken.save()
        return {
            statusCode: 200,
            status: CONSTANT_MSG.STATUS.SUCCESS,
            message: CONSTANT_MSG.EMAIL.EMAIL_CHANGED_SUCCESSFULLY,
        };
    } catch (error) {
        return {
            statusCode: 500,
            status: CONSTANT_MSG.STATUS.ERROR,
            message: error.message
        };
    }
}