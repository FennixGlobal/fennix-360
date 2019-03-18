const {UserSessionModel} = require('../models/user-session-model');

const generateAuthTokenQuery = async(userObj,authType)=>{
    console.log(UserSessionModel);
    return await UserSessionModel.generateAuthToken(userObj,authType);
};

module.exports = {
    generateAuthTokenQuery
};