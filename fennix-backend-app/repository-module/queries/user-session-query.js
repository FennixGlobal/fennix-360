const {UserSessionModel} = require('../models/user-session-model');

const generateAuthTokenQuery = async (userObj, authType, ip) => {
    const userSessionModel = await UserSessionModel.findUserByEmail(userObj.email_id);
    return await userSessionModel.generateAuthToken(userObj, authType, ip);
};
const generateCookieTokenQuery = async (userObj, authType, ip) => {
    const userSessionModel = await UserSessionModel.findUserByEmail(userObj.email_id);
    console.log(userSessionModel);
    const cookie = await userSessionModel.generateCookieToken(userObj, authType, ip);

    const userSessionModel2 = await UserSessionModel.findUserByEmail(userObj.email_id);
    console.log(userSessionModel2);
    const token = await userSessionModel2.generateAuthToken(userObj, authType, ip);
    return {cookie, token};
};

module.exports = {
    generateAuthTokenQuery,
    generateCookieTokenQuery
};