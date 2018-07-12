const {connectionCheckAndQueryExec} = require("../../util-module/custom-request-reponse-modifiers/response-creator");
const {userProfileQuery, insertUserQuery, updateUserProfileQuery, getUserListQuery, getUserNameFromUserIdQuery, getUserIdsForAdminQuery, getUserIdsForMasterAdminQuery, getUserIdsForSuperAdminQuery, getUserIdsForSupervisorQuery, getTotalNoOfUsersQuery} = require('../queries/user-query');
const {insertQueryCreator} = require("../../util-module/request-validators");
const {TABLE_USERS} = require('../../util-module/db-constants');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');

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

const getTotalNoOfUsersAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getTotalNoOfUsersQuery);
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

const getUserIdsForSupervisorAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getUserIdsForSupervisorQuery);
    return returnObj;
};

const getUserIdsForAdminAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getUserIdsForSupervisorQuery);
    return returnObj;
};

const getUserIdsForSuperAdminAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getUserIdsForSupervisorQuery);
    return returnObj;
};

const getUserIdsForMasterAdminAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getUserIdsForSupervisorQuery);
    return returnObj;
};
const getUserIdsForAllRolesAccessor = async (req) => {
    let userDetailResponse, otherUserIdsForGivenUserId, userIdList = [];
    userDetailResponse = await connectionCheckAndQueryExec([req.query.languageId, req.query.userId], getUserNameFromUserIdQuery);
    if (objectHasPropertyCheck(userDetailResponse, 'rows') && arrayNotEmptyCheck(userDetailResponse.rows)) {
        let nativeUserRole = userDetailResponse.rows[0]['native_user_role'];
        switch (nativeUserRole) {
            case 'ROLE_SUPERVISOR' : {
                otherUserIdsForGivenUserId = await getUserIdsForSupervisorAccessor([req.query.userId, req.query.languageId]);
                break;
            }
            case 'ROLE_ADMIN' : {
                otherUserIdsForGivenUserId = await getUserIdsForAdminAccessor([req.query.userId, req.query.languageId]);
                break;
            }
            case 'ROLE_SUPER_ADMIN' : {
                otherUserIdsForGivenUserId = await getUserIdsForSuperAdminAccessor([req.query.userId, req.query.languageId]);
                break;
            }
            case 'ROLE_MASTER_ADMIN' : {
                otherUserIdsForGivenUserId = await getUserIdsForMasterAdminAccessor([req.query.userId, req.query.languageId]);
                break;
            }
        }
        otherUserIdsForGivenUserId.rows.forEach(item => {
            userIdList.push(item['user_id']);
        });
    }
    return userIdList;
};
module.exports = {
    addUserAccessor,
    getUserNameFromUserIdAccessor,
    fetchUserProfileAccesor,
    updateUserProfileAccesor,
    getUserListAccesor,
    getUserIdsForSupervisorAccessor,
    getUserIdsForSuperAdminAccessor,
    getUserIdsForMasterAdminAccessor,
    getUserIdsForAdminAccessor,
    getTotalNoOfUsersAccessor,
    getUserIdsForAllRolesAccessor
};