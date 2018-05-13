const {selectBeneficiaryByUserIdQuery} = require('../queries/beneficiary-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');

var getBeneficiaryByUserId = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec( req, selectBeneficiaryByUserIdQuery);
    return returnObj;
};

module.exports = {
    getBeneficiaryByUserId
}