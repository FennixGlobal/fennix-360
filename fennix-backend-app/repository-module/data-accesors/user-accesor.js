const {TABLE_USERS} = require('../../util-module/db-constants');
const COMMON_CONSTANTS = require('../../util-module/util-constants/fennix-common-constants');

const userQueries = require('../queries/user-query');

const {connectionCheckAndQueryExec} = require("../../util-module/custom-request-reponse-modifiers/response-creator");
const {insertQueryCreator, updateQueryCreator} = require("../../util-module/request-validators");
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');

const fetchUserProfileAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.userProfileQuery);
    return returnObj;
};

const updateUserProfileAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.updateUserProfileQuery);
    return returnObj;
};

const getUserListAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.getUserListQuery);
    return returnObj;
};

const getTotalRecordsForListUsersAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.getTotalRecordsForListUsersQuery);
    return returnObj;
};

const addUserAccessor = async (req) => {
    let returnObj, finalResponse;
    finalResponse = insertQueryCreator(req, TABLE_USERS, userQueries.insertUserQuery);
    returnObj = await connectionCheckAndQueryExec(finalResponse.valuesArray, finalResponse.modifiedInsertQuery);
    return returnObj;
};

const getUserNameFromUserIdAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.getUserNameFromUserIdQuery);
    return returnObj;
};

const getUserIdsForSupervisorAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.getUserIdsForSupervisorQuery);
    return returnObj;
};

const getUserIdsForAdminAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.getUserIdsForAdminQuery);
    return returnObj;
};

const getUserIdsForSuperAdminAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.getUserIdsForSuperAdminQuery);
    return returnObj;
};

const getUserIdsForMasterAdminAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.getUserIdsForMasterAdminQuery);
    return returnObj;
};

const getUserIdsForGlobalAdminAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.getUserIdsForGlobalAdminQuery);
    return returnObj;
};

const getUserIdsForAllRolesAccessor = async (req, dataModifier) => {
    let userDetailResponse, otherUserIdsForGivenUserId, returnObj;
    userDetailResponse = await connectionCheckAndQueryExec([req.query.languageId, req.query.userId], userQueries.getUserNameFromUserIdQuery);
    if (objectHasPropertyCheck(userDetailResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(userDetailResponse.rows)) {
        let nativeUserRole = userDetailResponse.rows[0][COMMON_CONSTANTS.FENNIX_NATIVE_ROLE];
        switch (nativeUserRole) {
            case COMMON_CONSTANTS.FENNIX_NATIVE_ROLE_SUPERVISOR : {
                otherUserIdsForGivenUserId = await getUserIdsForSupervisorAccessor([req.query.userId, req.query.languageId]);
                break;
            }
            case COMMON_CONSTANTS.FENNIX_NATIVE_ROLE_ADMIN : {
                otherUserIdsForGivenUserId = await getUserIdsForAdminAccessor([req.query.userId, req.query.languageId]);
                break;
            }
            case COMMON_CONSTANTS.FENNIX_NATIVE_ROLE_SUPER_ADMIN : {
                otherUserIdsForGivenUserId = await getUserIdsForSuperAdminAccessor([req.query.locationId, req.query.languageId]);
                break;
            }
            case COMMON_CONSTANTS.FENNIX_NATIVE_ROLE_MASTER_ADMIN : {
                otherUserIdsForGivenUserId = await getUserIdsForMasterAdminAccessor([req.query.locationId, req.query.languageId]);
                break;
            }
            case COMMON_CONSTANTS.FENNIX_NATIVE_ROLE_GLOBAL_ADMIN : {
                otherUserIdsForGivenUserId = await getUserIdsForGlobalAdminAccessor([req.query.languageId]);
                break;
            }
        }
        if (objectHasPropertyCheck(otherUserIdsForGivenUserId, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(otherUserIdsForGivenUserId.rows)) {
            switch (dataModifier.toLowerCase()) {
                case COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID_NAME.toLowerCase():
                    returnObj = [];
                    otherUserIdsForGivenUserId.rows.forEach(item => {
                        let obj = {
                            userId: item['user_id'],
                            name: item['full_name']
                        };
                        returnObj.push(obj);
                    });
                    break;
                case COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID.toLowerCase():
                    returnObj = [];
                    otherUserIdsForGivenUserId.rows.forEach(item => {
                        returnObj.push(item['user_id']);
                    });
                    break;
                case COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_ALL.toLowerCase():
                    returnObj = otherUserIdsForGivenUserId;
                    break;
            }
        }
    }
    return returnObj;
};

const updateUserAccessor = async (req) => {
    let returnObj, updatedQueryCreatorResponse, fields = Object.keys(req.body), request = [];
    fields.sort();
    fields.splice(fields.indexOf('userId'), 1);
    updatedQueryCreatorResponse = updateQueryCreator('users', fields, 'user_id');
    updatedQueryCreatorResponse.presentFields.forEach((f) => request.push(req.body[f]));
    request.push(req.body.userId);
    returnObj = await connectionCheckAndQueryExec(request, updatedQueryCreatorResponse.query);
    return returnObj;
};

module.exports = {
    addUserAccessor,
    getUserNameFromUserIdAccessor,
    fetchUserProfileAccessor,
    updateUserProfileAccessor,
    getTotalRecordsForListUsersAccessor,
    getUserListAccessor,
    getUserIdsForSupervisorAccessor,
    getUserIdsForSuperAdminAccessor,
    getUserIdsForMasterAdminAccessor,
    getUserIdsForAdminAccessor,
    getUserIdsForAllRolesAccessor,
    updateUserAccessor,
};