const userSessionQueries = require('../queries/user-session-query');

const generateUserTokenAccessor = async (userObj,authType,ip)=>{
return await userSessionQueries.generateAuthTokenQuery(userObj,authType,ip)
};

const generateCookieTokenAccessor = async (userObj,authType,ip)=>{
    return await userSessionQueries.generateCookieTokenQuery(userObj,authType,ip)
};

const verifyUserSessionAccessor = async(emailId,authToken)=>{
    return await userSessionQueries.verifyUserSessionQuery(emailId,authToken);
};

const expireUserSessionAccessor = async(emailId,authToken)=>{
    return await userSessionQueries.expireUserSessionQuery(emailId,authToken);
};

module.exports = {
    generateUserTokenAccessor,
    verifyUserSessionAccessor,
    generateCookieTokenAccessor,
    expireUserSessionAccessor
};