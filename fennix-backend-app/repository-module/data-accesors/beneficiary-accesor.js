const {selectBeneficiaryByUserIdQuery, getTotalRecordsBasedOnOwnerUserIdCenterIdQuery, selectBeneficiaryNameFromBeneficiaryIdQuery, selectBeneficiaryByOwnerIdQuery, selectBeneficiaryListByOwnerUserIdQuery, getBenefeciaryIdListForOwnerAndCenterQuery} = require('../queries/beneficiary-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {requestInModifier} = require('../../util-module/request-validators');
var getBeneficiaryByUserId = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, selectBeneficiaryByUserIdQuery);
    return returnObj;
};

var getBenefeciaryAggregator = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, selectBeneficiaryByOwnerIdQuery);
    return returnObj;
};
const getBeneficiaryNameFromBeneficiaryIdAccessor = async (req, language) => {
    let returnObj, modifiedQuery;
    modifiedQuery = requestInModifier(req, selectBeneficiaryNameFromBeneficiaryIdQuery);
    let modifiedParams = [language];
    modifiedParams = [...modifiedParams, ...req];
    returnObj = await connectionCheckAndQueryExec(modifiedParams, modifiedQuery);
    return returnObj;
};

const getTotalRecordsBasedOnOwnerUserIdAndCenterAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getTotalRecordsBasedOnOwnerUserIdCenterIdQuery);
    return returnObj;
};


var getBeneficiaryListByOwnerId = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, selectBeneficiaryListByOwnerUserIdQuery);
    return returnObj;
};

// const getBeneficiaryMapData = async(req) => {
//     let returnObj;
//     returnObj = await connectionCheckAndQueryExec(req, getBenefeciaryIdListForOwnerAndCenterQuery);
//     return returnObj;
// };

var getBeneifciaryIdList = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getBenefeciaryIdListForOwnerAndCenterQuery);
    return returnObj;

}
module.exports = {
    getBeneficiaryByUserId,
    getBenefeciaryAggregator,
    getBeneficiaryListByOwnerId,
    getBeneifciaryIdList,
    getBeneficiaryNameFromBeneficiaryIdAccessor,
    getTotalRecordsBasedOnOwnerUserIdAndCenterAccessor
    // getBeneficiaryMapData
}