const {userIdDeviceAggregatorQuery,deviceDetailsByBeneficiaryId,getDeviceDetailsForListOfBeneficiariesQuery} = require('../queries/device-query');
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

const getDeviceDetailsForListOfBeneficiariesAccessor = async (req) => {
    let returnObj;
    returnObj = await getDeviceDetailsForListOfBeneficiariesQuery(req);
    return returnObj;
};

module.exports = {
    deviceAggregator,
    deviceBybeneficiaryQuery,
    getDeviceDetailsForListOfBeneficiariesAccessor
};