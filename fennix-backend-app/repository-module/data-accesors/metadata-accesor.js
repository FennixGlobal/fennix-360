const {cardWidgetMetadataQuery, filterMetadataQuery, getRolesForRoleIdQuery, modalMetadataQuery, headerMetadataQuery, sideNavMetadataQuery, loginMetadataQuery, getRoleQuery} = require('../queries/metadata-query');
const {selectCenterIdsForGivenUserIdQuery} = require('../queries/location-query');
const {selectLanguagesQuery} = require('../queries/language-query');
const {getUserNameFromUserIdAccessor} = require('../data-accesors/user-accesor');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require("../../util-module/data-validators");
const {filterQueryCreator} = require('../../util-module/request-validators');
const {insertSimcardQuery, deleteSimcardQuery, getSimcardDetailsQuery, updateSimcardQuery} = require('../queries/simcard-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const locationQueries = require('../queries/location-query');

const getCardMetadataAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, cardWidgetMetadataQuery);
    return returnObj;
};
const getSideNavMetadataAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, sideNavMetadataQuery);
    return returnObj;
};
const getRolesForRoleIdAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getRolesForRoleIdQuery);
    return returnObj;
};

const getSimcardDetailsAccessor = async (req) => {
    let responseObj;
    responseObj = await getSimcardDetailsQuery(req);
    return responseObj;
};

const getHeaderMetadataAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, headerMetadataQuery);
    return returnObj;
};

const getCenterIdsBasedOnUserIdAccessor = async (req) => {
    let centerIdResponse;
    centerIdResponse = await connectionCheckAndQueryExec(req, selectCenterIdsForGivenUserIdQuery);
    return centerIdResponse;
};

const getFilterMetadataAccessor = async (req, colName) => {
    let returnObj, modifiedFilterQuery;
    modifiedFilterQuery = filterQueryCreator(filterMetadataQuery, colName);
    returnObj = await connectionCheckAndQueryExec(req, modifiedFilterQuery);
    return returnObj;
};

const getLanguagesAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, selectLanguagesQuery);
    return returnObj;
};

const getLoginMetadataAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, loginMetadataQuery);
    return returnObj;
};
const getModalMetadataAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, modalMetadataQuery);
    return returnObj;
};


const getRolesAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getRoleQuery);
    return returnObj;
};

const getCenterIdsAccessor = async (req) => {
    let userDetailResponse, centerIdResponse, request = [req.query.userId];
    userDetailResponse = await getUserNameFromUserIdAccessor([req.query.languageId, req.query.userId]);
    if (objectHasPropertyCheck(userDetailResponse, 'rows') && arrayNotEmptyCheck(userDetailResponse.rows)) {
        let nativeUserRole = userDetailResponse.rows[0]['native_user_role'];
        switch (nativeUserRole) {
            case 'ROLE_OPERATOR' : {
                centerIdResponse = await connectionCheckAndQueryExec(request, locationQueries.selectCenterIdsForOperatorQuery);
                break;
            }
            case 'ROLE_SUPERVISOR' : {
                centerIdResponse = await connectionCheckAndQueryExec(request, locationQueries.selectCenterIdsForSupervisorQuery);
                break;
            }
            case 'ROLE_ADMIN' : {
                centerIdResponse = await connectionCheckAndQueryExec(request, locationQueries.selectCenterIdsForAdminQuery);
                break;
            }
            case 'ROLE_SUPER_ADMIN' : {
                centerIdResponse = await connectionCheckAndQueryExec(request, locationQueries.selectCenterIdsForSuperAdminQuery);
                break;
            }
            case 'ROLE_MASTER_ADMIN' : {
                centerIdResponse = await connectionCheckAndQueryExec(request, locationQueries.selectAllCenterIdsForMasterAdminQuery);
                break;
            }
        }
    }
    return centerIdResponse;
};

// const getCenterIdsForOperatorAccessor = async (req) => {
//     let centerIdResponse;
//     centerIdResponse = await connectionCheckAndQueryExec(req, locationQueries.selectCenterIdsForOperatorQuery);
//     return centerIdResponse;
// };
//
// const getCenterIdsForSupervisorAccessor = async (req) => {
//     let centerIdResponse;
//     centerIdResponse = await connectionCheckAndQueryExec(req, locationQueries.selectCenterIdsForSupervisorQuery);
//     return centerIdResponse;
// };
//
// const getCenterIdsForAdminAccessor = async (req) => {
//     let centerIdResponse;
//     centerIdResponse = await connectionCheckAndQueryExec(req, locationQueries.selectCenterIdsForAdminQuery);
//     return centerIdResponse;
// };
//
// const getCenterIdsForSuperAdminAccessor = async (req) => {
//     let centerIdResponse;
//     centerIdResponse = await connectionCheckAndQueryExec(req, locationQueries.selectCenterIdsForSuperAdminQuery);
//     return centerIdResponse;
// };
//
// const getCenterIdsForMasterAdminAccessor = async (req) => {
//     let centerIdResponse;
//     centerIdResponse = await connectionCheckAndQueryExec(req, locationQueries.selectAllCenterIdsForMasterAdminQuery);
//     return centerIdResponse;
// };

module.exports = {
    getCardMetadataAccessor,
    getSideNavMetadataAccessor,
    getHeaderMetadataAccessor,
    getLoginMetadataAccessor,
    getCenterIdsBasedOnUserIdAccessor,
    getSimcardDetailsAccessor,
    getLanguagesAccessor,
    getRolesAccessor,
    getRolesForRoleIdAccessor,
    getFilterMetadataAccessor,
    getModalMetadataAccessor,
    getCenterIdsAccessor
    // getDropdownAccessor,
    // getCenterIdsForAdminAccessor,
    // getCenterIdsForSupervisorAccessor,
    // getCenterIdsForOperatorAccessor,
    // getCenterIdsForSuperAdminAccessor,
    // getCenterIdsForMasterAdminAccessor,
};

