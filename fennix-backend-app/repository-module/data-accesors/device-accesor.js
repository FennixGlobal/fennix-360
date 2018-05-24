const {userIdDeviceAggregatorQuery,deviceDetailsByBeneficiaryId} = require('../queries/device-query');
// const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
var deviceAggregator = async (req) => {
    let returnObj;
    returnObj = await userIdDeviceAggregatorQuery(req);
    return returnObj;
};

const deviceBybeneficiaryQuery = async (req) => {
    let returnObj;
    returnObj = await deviceDetailsByBeneficiaryId(req);
    return returnObj;
};
module.exports = {
    deviceAggregator,
    deviceBybeneficiaryQuery
};