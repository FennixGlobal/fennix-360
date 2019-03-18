const UserSessionModel = require('../models/user-session-model');

const generateAuthTokenQuery = async (userObj, authType) => {
    console.log(UserSessionModel);
    const userSessionModel = await UserSessionModel.findUserByEmail(userObj.email_id);
    console.log(userSessionModel);
    return await userSessionModel.generateAuthToken(userObj, authType);
};

module.exports = {
    generateAuthTokenQuery
};