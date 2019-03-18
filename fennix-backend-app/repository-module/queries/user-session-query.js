const UserSessionModel = require('../models/user-session-model');

const generateAuthTokenQuery = async (userObj, authType) => {
    const userSessionModel = await UserSessionModel.findUserByEmail(userObj.email_id);
    console.log(userSessionModel);
    return await UserSessionModel.generateAuthToken(userObj, authType);
};

module.exports = {
    generateAuthTokenQuery
};