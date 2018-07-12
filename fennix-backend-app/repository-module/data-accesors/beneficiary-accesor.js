const {selectBeneficiaryByUserIdQuery, getBeneficiaryByBeneficiaryIdQuery,insertBeneficiaryQuery,getBeneficiaryDetailsQuery, getTotalRecordsBasedOnOwnerUserIdCenterIdQuery, selectBeneficiaryNameFromBeneficiaryIdQuery, selectBeneficiaryByOwnerIdQuery, selectBeneficiaryListByOwnerUserIdQuery, getBenefeciaryIdListForOwnerAndCenterQuery} = require('../queries/beneficiary-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {requestInModifier} = require('../../util-module/request-validators');
const {TABLE_BENEFICIARIES} = require('../../util-module/db-constants');

const getBeneficiaryByUserIdAccessor = async (req) => {
    let returnObj, modifiedQuery;
    modifiedQuery = requestInModifier(req, selectBeneficiaryByUserIdQuery, false);
    returnObj = await connectionCheckAndQueryExec(req, modifiedQuery);
    return returnObj;
};

const getBenefeciaryAggregator = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, selectBeneficiaryByOwnerIdQuery);
    return returnObj;
};
const getBeneficiaryNameFromBeneficiaryIdAccessor = async (req, language) => {
    let returnObj, modifiedQuery;
    modifiedQuery = requestInModifier(req, selectBeneficiaryNameFromBeneficiaryIdQuery, true);
    let modifiedParams = [language];
    modifiedParams = [...modifiedParams, ...req];
    returnObj = await connectionCheckAndQueryExec(modifiedParams, modifiedQuery);
    return returnObj;
};

const addBeneficiaryAccessor = async (req) => {
    let returnObj, finalResponse;
    finalResponse = insertQueryCreator(req, TABLE_BENEFICIARIES, insertBeneficiaryQuery);
    returnObj = await connectionCheckAndQueryExec(finalResponse.valuesArray, finalResponse.modifiedInsertQuery);
    console.log(returnObj);
    return returnObj;
};


const getTotalRecordsBasedOnOwnerUserIdAndCenterAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getTotalRecordsBasedOnOwnerUserIdCenterIdQuery);
    return returnObj;
};


// const getBeneficiaryListByOwnerId = async (req) => {
//     let returnObj;
//     returnObj = await connectionCheckAndQueryExec(req, selectBeneficiaryListByOwnerUserIdQuery);
//     return returnObj;
// };

const getBeneficiaryByBeneficiaryIdAccesor = async(req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getBeneficiaryByBeneficiaryIdQuery);
    return returnObj;
};

const getBeneficiaryDetailsAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getBeneficiaryDetailsQuery);
    return returnObj;
};

const getBeneifciaryIdList = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getBenefeciaryIdListForOwnerAndCenterQuery);
    return returnObj;
};
const getBeneficiaryListByOwnerId = async (req) => {
    let returnObj, request = [...req.userIdList,req.centerId, req.skip, req.limit], modifiedQuery, extraQuery = `and center_id = $${req.userIdList.length+1} order by device_updated_date desc nulls last offset $${req.userIdList.length+2} limit $${req.userIdList.length+3}`;
    modifiedQuery = requestInModifier(req.userIdList, selectBeneficiaryListByOwnerUserIdQuery, false);
    modifiedQuery = `${modifiedQuery}${extraQuery}`;
    returnObj = await connectionCheckAndQueryExec(request, modifiedQuery);
    return returnObj;
};

module.exports = {
    getBeneficiaryByUserIdAccessor,
    getBenefeciaryAggregator,
    getBeneficiaryListByOwnerId,
    getBeneifciaryIdList,
    getBeneficiaryDetailsAccessor,
    getBeneficiaryNameFromBeneficiaryIdAccessor,
    getTotalRecordsBasedOnOwnerUserIdAndCenterAccessor,
    addBeneficiaryAccessor,
    getBeneficiaryByBeneficiaryIdAccesor
    // getBeneficiaryMapData
};

// getDeviceDetailsForListOfBeneficiariesAccessor