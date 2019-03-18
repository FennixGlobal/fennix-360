const userSessionQueries = require('../queries/user-session-query');

const generateUserTokenAccessor = async (userObj,authType)=>{
return await userSessionQueries.generateAuthTokenQuery(userObj,authType)
};

module.exports = {
    generateUserTokenAccessor
};