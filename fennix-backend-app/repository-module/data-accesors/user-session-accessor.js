const userSessionQueries = require('../queries/user-session-query');

const generateUserTokenAccessor = async (userObj,authType,ip)=>{
return await userSessionQueries.generateAuthTokenQuery(userObj,authType,ip)
};

const generateCookieTokenAccessor = async (userObj,authType,ip)=>{
    return await userSessionQueries.generateCookieTokenQuery(userObj,authType,ip)
};

module.exports = {
    generateUserTokenAccessor,
    generateCookieTokenAccessor
};