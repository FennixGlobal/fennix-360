const {UserSessionModel} = require('../models/user-session-model');

const generateAuthTokenQuery = async (userObj, authType, ip) => {
    const userSessionModel = await UserSessionModel.findUserByEmail(userObj.email_id);
    return await userSessionModel.generateAuthToken(userObj, authType, ip);
};
const generateCookieTokenQuery = async (userObj, authType, ip) => {
    const userSessionModel = await UserSessionModel.findUserByEmail(userObj.email_id);
    const token = await userSessionModel.generateAuthToken(userObj, authType, ip);
    const cookie = await userSessionModel.generateCookieToken(userObj, authType, ip);
    return {cookie, token};
};

module.exports = {
    generateAuthTokenQuery,
    generateCookieTokenQuery
};