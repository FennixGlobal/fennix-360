const {UserSessionModel} = require('../models/user-session-model');

const generateAuthTokenQuery = async (userObj, authType, ip) => {
    const userSessionModel = await UserSessionModel.findUserByEmail(userObj.email_id);
    return await userSessionModel.generateAuthToken(userObj, authType, ip);
};
const generateCookieTokenQuery = async (userObj, authType, ip) => {
    const userSessionModel = await UserSessionModel.findUserByEmail(userObj.email_id);
    return await userSessionModel.generateCookieToken(userObj, authType, ip);
};

const verifyUserSessionQuery = async (emailId, authToken) => {
    return
};


const expireUserSessionQuery  = async (emailId, authToken) => {
    await UserSessionModel.findOne({userEmailId: emailId, 'tokens.token': authToken})
};

module.exports = {
    verifyUserSessionQuery,
    expireUserSessionQuery,
    generateAuthTokenQuery,
    generateCookieTokenQuery
};