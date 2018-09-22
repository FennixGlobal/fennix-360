const {getBeneficiaryLocationList, locationCounterQuery, locationDetailsUpdateQuery,getCountryCodeByLocationIdQuery, selectCenterIdsForLoggedInUserAndSubUsersQuery, selectCenterIdsForGivenUserIdQuery, selectCountryForSuperAdminQuery, selectAllCountriesForMasterAdminQuery, selectCountryForSupervisorAndAdminQuery} = require('../queries/location-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {requestInModifier} = require('../../util-module/request-validators');

const mapMarkerQuery = async (req) => {
    let returnObj;
    returnObj = await getBeneficiaryLocationList(req);
    return returnObj;
};

const getCountryCodeByLocationIdAccessor = async(locationId)=>{
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(locationId, getCountryCodeByLocationIdQuery);
    return returnObj;
};

const updateLocation = async (req) => {
    let counterResponse = await locationCounterQuery(), locationId;
    locationId = counterResponse['_doc']['counter'];
    // locationId = counterResponse[0]['counter'];
    let obj = {
        _id: locationId, ...req
    };
    locationDetailsUpdateQuery(obj);
    return counterResponse;
};

const getCenterIdsForLoggedInUserAndSubUsersAccessor = async (req) => {
    let returnObj, modifiedQuery;
    modifiedQuery = requestInModifier(req, selectCenterIdsForLoggedInUserAndSubUsersQuery, false);
    returnObj = await connectionCheckAndQueryExec(req, modifiedQuery);
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
    getCountryListAccessor,
    getCenterIdsAccessor,
    updateLocation,
    getCountryCodeByLocationIdAccessor,
    getCenterIdsForLoggedInUserAndSubUsersAccessor
};
