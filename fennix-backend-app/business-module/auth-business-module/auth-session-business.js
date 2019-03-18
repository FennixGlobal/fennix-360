const authDataAccessors = require('../../repository-module/data-accesors/user-session-accessor');

const userLoginBusiness = async (req) =>{
    const userSession = await authDataAccessors.generateUserTokenAccessor(req);
    console.log(userSession);
    return userSession;
};

module.exports = {
    userLoginBusiness
};