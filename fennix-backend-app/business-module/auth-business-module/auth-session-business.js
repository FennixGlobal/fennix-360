const authDataAccessors = require('../../repository-module/data-accesors/user-session-accessor');

const userLoginBusiness = async (req,authType,ip) =>{
    const userSession = await authDataAccessors.generateUserTokenAccessor(req,authType,ip);
    console.log(userSession);
    return userSession;
};

const userCookieTokenBusiness = async (req,authType,ip) =>{
    const userSession = await authDataAccessors.generateCookieTokenAccessor(req,authType,ip);
    console.log(userSession);
    return userSession;
};

module.exports = {
    userLoginBusiness,
    userCookieTokenBusiness
};