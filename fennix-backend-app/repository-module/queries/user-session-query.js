const {UserSessionModel} = require('../models/user-session-model');

const generateAuthTokenQuery = async (userObj, authType, ip) => {
    const userSessionModel = await UserSessionModel.findUserByEmail(userObj.email_id);
    return await userSessionModel.generateAuthToken(userObj, authType, ip);
};
const generateCookieTokenQuery = async (userObj, authType, ip) => {
    return await UserSessionModel.generateCookieToken(userObj, authType, ip);
};

module.exports = {
    generateAuthTokenQuery,
    generateCookieTokenQuery
};