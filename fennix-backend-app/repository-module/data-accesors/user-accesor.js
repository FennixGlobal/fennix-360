const {connectionCheckAndQueryExec} = require("../../util-module/custom-request-reponse-modifiers/response-creator");
const userQueries = require('../queries/user-query');
const {insertQueryCreator, updateQueryCreator} = require("../../util-module/request-validators");
const {TABLE_USERS} = require('../../util-module/db-constants');
const COMMON_CONSTANTS = require('../../util-module/util-constants/fennix-common-constants');
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
    returnObj = await connectionCheckAndQueryExec(req, userQueries.getUserIdsForSupervisorQuery);
    return returnObj;
};

const getUserIdsForSuperAdminAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.getUserIdsForSupervisorQuery);
    return returnObj;
};

const getUserIdsForMasterAdminAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, userQueries.getUserIdsForSupervisorQuery);
    return returnObj;
};
//
// //TODO: modify below method later
// const getUserIdNamesForAllRolesAccessor = async (req) => {
//     let userDetailResponse, otherUserIdsForGivenUserId, userIdNameList = [];
//     userDetailResponse = await connectionCheckAndQueryExec([req.query.languageId, req.query.userId], userQueries.getUserNameFromUserIdQuery);
//     if (objectHasPropertyCheck(userDetailResponse, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(userDetailResponse.rows)) {
//         let nativeUserRole = userDetailResponse.rows[0][COMMON_CONSTANTS.FENNIX_NATIVE_ROLE];
//         switch (nativeUserRole) {
//             case COMMON_CONSTANTS.FENNIX_NATIVE_ROLE_SUPERVISOR : {
//                 otherUserIdsForGivenUserId = await getUserIdsForSupervisorAccessor([req.query.userId, req.query.languageId]);
//                 break;
//             }
//             case COMMON_CONSTANTS.FENNIX_NATIVE_ROLE_ADMIN : {
//                 otherUserIdsForGivenUserId = await getUserIdsForAdminAccessor([req.query.userId, req.query.languageId]);
//                 break;
//             }
//             case COMMON_CONSTANTS.FENNIX_NATIVE_ROLE_SUPER_ADMIN : {
//                 otherUserIdsForGivenUserId = await getUserIdsForSuperAdminAccessor([req.query.userId, req.query.languageId]);
//                 break;
//             }
//             case COMMON_CONSTANTS.FENNIX_NATIVE_ROLE_MASTER_ADMIN : {
//                 otherUserIdsForGivenUserId = await getUserIdsForMasterAdminAccessor([req.query.userId, req.query.languageId]);
//                 break;
//             }
//         }
//         otherUserIdsForGivenUserId.rows.forEach(item => {
//             let obj = {
//                 userId: item['user_id'],
//                 name: item['full_name']
//             };
//             userIdNameList.push(obj);
//         });
//     }
//     return userIdNameList;
// };

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
                otherUserIdsForGivenUserId = await getUserIdsForSuperAdminAccessor([req.query.userId, req.query.languageId]);
                break;
            }
            case COMMON_CONSTANTS.FENNIX_NATIVE_ROLE_MASTER_ADMIN : {
                otherUserIdsForGivenUserId = await getUserIdsForMasterAdminAccessor([req.query.userId, req.query.languageId]);
                break;
            }
        }
        switch (dataModifier.toLowerCase()) {
            case COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID_NAME:
                returnObj = [];
                otherUserIdsForGivenUserId.rows.forEach(item => {
                    let obj = {
                        userId: item['user_id'],
                        name: item['full_name']
                    };
                    returnObj.push(obj);
                });
                break;
            case COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID:
                returnObj = [];
                otherUserIdsForGivenUserId.rows.forEach(item => {
                    returnObj.push(item['user_id']);
                });
                break;
            case COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_ALL:
                returnObj = otherUserIdsForGivenUserId;
                break;
        }
    }
    return returnObj;
};

const updateUserAccessor = async (req) => {
    let returnObj, updatedQuery, fields = Object.keys(req.body), request = [];
    fields.sort();
    fields.splice(fields.indexOf('userId'), 1);
    updatedQuery = updateQueryCreator('users', fields, 'userId');
    fields.forEach((f) => request.push(req.body[f]));
    request.push(req.body.userId);
    returnObj = await connectionCheckAndQueryExec(request, updatedQuery);
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
    // getUserIdNamesForAllRolesAccessor
};