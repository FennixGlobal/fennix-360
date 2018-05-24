const {selectBeneficiaryByUserIdQuery, selectBeneficiaryByOwnerIdQuery, selectBeneficiaryListByOwnerUserIdQuery,getBenefeciaryIdListForOwnerAndCenterQuery} = require('../queries/beneficiary-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');

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

var getBeneifciaryIdList = async(req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getBenefeciaryIdListForOwnerAndCenterQuery);
    return returnObj;

}
module.exports = {
    getBeneficiaryByUserId,
    getBenefeciaryAggregator,
    getBeneficiaryListByOwnerId,
    getBeneifciaryIdList,
    // getBeneficiaryMapData
}