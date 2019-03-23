const authDataAccessors = require('../../repository-module/data-accesors/user-session-accessor');

const userLoginBusiness = async (req, authType, ip) => {
    return await authDataAccessors.generateUserTokenAccessor(req, authType, ip);
};

const userCookieTokenBusiness = async (req, authType, ip) => {
    return await authDataAccessors.generateCookieTokenAccessor(req, authType, ip);
};

const verifyUserSessionBusiness = async (req) => {
    return await authDataAccessors.verifyUserSessionAccessor(req.emailId, req.authToken);
};

const expireUserSessionBusiness = async (req) => {
    return await authDataAccessors.expireUserSessionAccessor(req.emailId, req.authToken);
};
module.exports = {
    userLoginBusiness,
    userCookieTokenBusiness,
    verifyUserSessionBusiness,
    expireUserSessionBusiness
};