const userSessionQueries = require('../queries/user-session-query');

const generateUserTokenAccessor = async (userObj,authType,ip)=>{
return await userSessionQueries.generateAuthTokenQuery(userObj,authType,ip)
};

module.exports = {
    generateUserTokenAccessor
};