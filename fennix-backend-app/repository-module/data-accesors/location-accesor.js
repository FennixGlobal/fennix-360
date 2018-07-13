const {getBeneficiaryLocationList,locationCounterQuery,insertNextPrimaryKeyQuery,locationDetailsUpdateQuery,selectCenterIdsForLoggedInUserAndSubUsersQuery,selectCenterIdsForGivenUserIdQuery,selectCountryForSuperAdminQuery,selectAllCountriesForMasterAdminQuery,selectCountryForSupervisorAndAdminQuery} = require('../queries/location-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {requestInModifier} = require('../../util-module/request-validators');

const mapMarkerQuery = async (req) => {
    let returnObj;
    returnObj = await getBeneficiaryLocationList(req);
    return returnObj;
};

const updateLocation = async(req)=>{
    let counterResponse = await locationCounterQuery(), locationId;
    locationId = counterResponse[0]['_doc']['_id'];
    console.log('location counter');
    console.log(locationId);
    let obj = {
      _id: locationId, ...req
    };
    console.log(req);
    locationDetailsUpdateQuery(obj);
    insertNextPrimaryKeyQuery(locationId);
    // console.log(counterResponse[0]['_doc']['_id']);
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
    mapMarkerQuery,
    getCountryListAccessor,
    getCenterIdsAccessor,
    updateLocation,
    getCenterIdsForLoggedInUserAndSubUsersAccessor
};
