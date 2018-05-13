const {checkUserEmailQuery, authenticateUser} = require('../queries/user-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');

/**
 * @description - this method is used to check if the user email Id exists in DB
 * @param(req) - The request consists of user email
 * @returns(returnObj) - This consists of a Promise for obtained data
 * **/
var checkUserEmailId = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec( req, checkUserEmailQuery);
    return returnObj;
};
/**
 * @description - this method is used to authenticate the users
 * @param(req) - The request consists of user email and password which is decoded
 * @returns(returnObj) - This consists of a Promise for obtained data
 * **/
var authenticateUserDetails = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec( req, authenticateUser);
    return returnObj;
};

/**
 * @description - this method is used to change password for that particualr  user email Id
 * @param(req) - The request consists of user email, old password and new password
 * @returns(returnObj) - This consists of a Promise for obtained data
 * **/
var updateUserPassword = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec( req, updateUserPassword);
    return returnObj;
};

module.exports = {
    checkUserEmailId,
    updateUserPassword,
    authenticateUserDetails
};
