const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);
let SchemaType = mongoose.Schema.Types;
const jwt = require('jsonwebtoken');// This method is used to implement the auth token to be ping ponged back and forth for the request authentication.
const {authAgeTypeMap, JWTSecretPass} = require('../../util-module/util-constants/auth-constants');

const UserSessionSchema = new Schema({
    userEmailId: {type: String, required: true, unique: true},
    tokens: [{
        token: String,
        tokenType: {type: String, enum: ['change_password', 'forgot_password', 'login']},
        _id: SchemaType.ObjectId,
        ipAddress: String,
        tokenCreationDate: {type: Number, default: new Date().getTime()},
        isExpiryFlag: {type: Boolean, default: true},
        tokenExpiredDate: Number,
        tokenExpiryDate: Number
    }]
});

const UserSessionModel = mongoose.model('UserSessions', UserSessionSchema);

UserSessionSchema.statics.findUserByEmail = async function (emailId) {
    let userSession = UserSessionModel.findOne({userEmailId: emailId});
    if (!userSession) {
        userSession = new UserSessionModel({
            userEmailId: emailId,
            tokens: []
        });
        await userSession.save();
    }
    return userSession;
};

UserSessionSchema.methods.generateAuthToken = async function (userObj, authType) {
    const user = this;
    const date = new Date();
    const tokenObj = createTokenObject(userObj, authType);
    const currentUser = await user.findOne({userEmailId: userObj.email_id});
    if (currentUser) {
        currentUser.tokens = currentUser.tokens.forEach((item) => {
            if (item.tokenType === authType && !item.isExpiryFlag) {
                item.isExpiryFlag = true;
                item.tokenExpiredDate = date.getTime();
            }
        });
        currentUser.tokens = currentUser.tokens.concat([tokenObj]);
        currentUser.save();
    } else {
        const newUser = new UserSessionModel({
            userEmailId: userObj.email_id,
            tokens: [tokenObj]
        });
        await newUser.save();
    }
    return tokenObj.token;
};

const createTokenObject = (userObj, authType) => {
    const date = new Date();
    const newDate = date.setDate(date.getDate() + authAgeTypeMap[authType]);
    const token = jwt.sign(userObj, JWTSecretPass);
    return {
        token,
        tokenType: authType,
        isExpiryFlag: false,
        tokenExpiryDate: newDate
    }
};

module.exports = {
    UserSessionModel
};