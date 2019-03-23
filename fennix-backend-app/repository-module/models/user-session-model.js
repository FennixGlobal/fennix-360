const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);
let SchemaType = mongoose.Schema.Types;
const jwt = require('jsonwebtoken');// This method is used to implement the auth token to be ping ponged back and forth for the request authentication.
const {authAgeTypeMap, JWTSecretPass} = require('../../util-module/util-constants/auth-constants');
const TokenSchema = new Schema({
    token: String,
    tokenType: {type: String, enum: ['change_password', 'forgot_password', 'login', 'cookie']},
    _id: SchemaType.ObjectId,
    ipAddress: String,
    tokenCreationDate: {type: Number, default: new Date().getTime()},
    isExpiredFlag: {type: Boolean, default: true},
    tokenExpiredDate: Number,
    tokenExpiryDate: Number
});
const UserSessionSchema = new Schema({
    userEmailId: {type: String, required: true, unique: true},
    tokens: [TokenSchema]
});


UserSessionSchema.statics.findUserByEmail = async function (emailId) {
    let userSession = await UserSessionModel.findOne({userEmailId: emailId});
    if (!userSession) {
        userSession = new UserSessionModel({
            userEmailId: emailId,
            tokens: []
        });
        await userSession.save();
    }
    return userSession;
};

UserSessionSchema.methods.generateAuthToken = async function (userObj, authType, ip) {
    const user = this;
    const tokenObj = createTokenObject(userObj, authType, ip);
    if (user) {
        user.tokens = user.tokens.concat([tokenObj]);
        user.save();
    }
    return tokenObj.token;
};

UserSessionSchema.statics.verifyAuthToken = async function (emailId, authToken) {
    const user = await UserSessionModel.findOne({userEmailId: emailId}), date = new Date();
    let isVerifiedFlag = false;
    if (user && user.tokens) {
        const token = user.tokens.filter((item) => item.token === authToken);
        isVerifiedFlag = token && token.length > 0 && !token[0]['isExpiredFlag'] && date.getTime() < token[0]['tokenExpiryDate'];
        if (!isVerifiedFlag) {
            await UserSessionModel.updateOne({userEmailId: emailId, 'tokens.token': authToken}, {
                $set: {
                    isExpiredFlag: true,
                    tokenExpiredDate: date.getTime()
                }
            });
        }
    }
    return isVerifiedFlag;
};

UserSessionSchema.methods.generateCookieToken = async function (userObj, authType, ip) {
    const user = this;
    let tokenObj = null;
    if (user) {
        tokenObj = createTokenObject(userObj, authType, ip);
        await UserSessionModel.update({_id: user._id}, {$push: {tokens: tokenObj}});
    }
    return tokenObj ? tokenObj.token : null;
};

UserSessionSchema.methods.expireAuthToken = async function (emailId, authToken) {
    const user = await UserSessionModel.findOne({userEmailId: emailId}), date = new Date();
    let isExpiredFlag = false;
    if (user && user.tokens) {
        isExpiredFlag = true;
        await UserSessionModel.updateOne({userEmailId: emailId, 'tokens.token': authToken}, {
            $set: {
                isExpiredFlag: true,
                tokenExpiredDate: date.getTime()
            }
        });
    }
    return isExpiredFlag;
};

const createTokenObject = (userObj, authType, ip) => {
    const date = new Date();
    const newDate = date.setDate(authAgeTypeMap[authType] ? date.getDate() + authAgeTypeMap[authType] : date.getDate());
    const token = jwt.sign(userObj, JWTSecretPass);
    return {
        token,
        ipAddress: ip,
        tokenType: authType,
        isExpiredFlag: false,
        tokenExpiryDate: newDate
    }
};

const UserSessionModel = mongoose.model('UserSessions', UserSessionSchema, 'userSessions');
module.exports = {UserSessionModel};
