const {userSessionModel} = require('../models/user-session-model');

const generateAuthTokenQuery = async(userObj,authType)=>{
    return await userSessionModel.generateAuthToken(userObj,authType)
};

module.exports = {
    generateAuthTokenQuery
};