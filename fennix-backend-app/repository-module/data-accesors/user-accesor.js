const {connectionCheckAndQueryExec} = require("../../util-module/custom-request-reponse-modifiers/response-creator");
const {userProfileQuery, updateUserProfileQuery, getUserListQuery,getUserNameFromUserIdQuery} = require('../queries/user-query');

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

const getUserNameFromUserIdAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getUserNameFromUserIdQuery);
    return returnObj;
};

module.exports = {
    getUserNameFromUserIdAccessor,
    fetchUserProfileAccesor,
    updateUserProfileAccesor,
    getUserListAccesor
};