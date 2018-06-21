const {connectionCheckAndQueryExec} = require("../../util-module/custom-request-reponse-modifiers/response-creator");
const {userProfileQuery, insertUserQuery, updateUserProfileQuery, getUserListQuery, getUserNameFromUserIdQuery} = require('../queries/user-query');
const {insertQueryCreator} = require("../../util-module/request-validators");
const fetchUserProfileAccesor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userProfileQuery);
    return returnObj;
};

const updateUserProfileAccesor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, updateUserProfileQuery);
    return returnObj;
};

const getUserListAccesor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getUserListQuery);
    return returnObj;
};
const addUserAccessor = async (req) => {
    let returnObj, finalResponse;
    finalResponse = insertQueryCreator(req, TABLE_USERS, insertUserQuery);
    returnObj = await connectionCheckAndQueryExec(finalResponse.valuesArray, finalResponse.modifiedInsertQuery);
    return returnObj;
};

const getUserNameFromUserIdAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getUserNameFromUserIdQuery);
    return returnObj;
};

module.exports = {
    addUserAccessor,
    getUserNameFromUserIdAccessor,
    fetchUserProfileAccesor,
    updateUserProfileAccesor,
    getUserListAccesor
};