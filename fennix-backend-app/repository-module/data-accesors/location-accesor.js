const {getBeneficiaryLocationList,selectCenterIdsForGivenUserIdQuery,selectCountryForSuperAdminQuery,selectAllCountriesForMasterAdminQuery,selectCountryForSupervisorAndAdminQuery} = require('../queries/location-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');

const mapMarkerQuery = async (req) => {
    let returnObj;
    returnObj = await getBeneficiaryLocationList(req);
    return returnObj;
};

const getCenterIdsAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, selectCenterIdsForGivenUserIdQuery);
    return returnObj;
};
const getCountryListAccessor = async (req) => {
    let countryListResponse, request = [req.userId, req.languageId];
    switch (req.userRole) {
        case 'ROLE_SUPERVISOR':
        case 'ROLE_ADMIN': {
            countryListResponse = await connectionCheckAndQueryExec(request, selectCountryForSupervisorAndAdminQuery);
            break;
        }
        case 'ROLE_SUPER_ADMIN' : {
            countryListResponse = await connectionCheckAndQueryExec(request, selectCountryForSuperAdminQuery);
            break;
        }
        case 'ROLE_MASTER_ADMIN' : {
            countryListResponse = await connectionCheckAndQueryExec(request, selectAllCountriesForMasterAdminQuery);
        }
    }
    return countryListResponse;
};

module.exports = {
    mapMarkerQuery,
    getCountryListAccessor,
    getCenterIdsAccessor
};
