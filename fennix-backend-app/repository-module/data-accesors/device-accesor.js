const {insertNextPrimaryKeyQuery,fetchNextPrimaryKeyQuery,insertDeviceQuery,userIdDeviceAggregatorQuery,deviceDetailsByBeneficiaryId,getDeviceDetailsForListOfBeneficiariesQuery,listDeviceTypesQuery, listDevicesQuery} = require('../queries/device-query');
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

const listDevicesAccessor = async (req) => {
    let returnObj;
    returnObj = await listDevicesQuery(req);
    return returnObj;
};
const listDeviceTypesAccessor = async () => {
    let returnObj;
    returnObj = await listDeviceTypesQuery();
    return returnObj;
};

const insertDeviceAccessor = async (req) => {
    insertDeviceQuery(req);
};

const fetchNextPrimaryKeyAccessor = async () => {
    let returnObj;
    returnObj = await fetchNextPrimaryKeyQuery();
    return returnObj;
};

const insertNextPrimaryKeyAccessor = async (req) => {
    await insertNextPrimaryKeyQuery(req);
};

module.exports = {
    deviceAggregator,
    listDeviceTypesAccessor,
    deviceBybeneficiaryQuery,
    getDeviceDetailsForListOfBeneficiariesAccessor,
    listDevicesAccessor,
    insertDeviceAccessor,
    fetchNextPrimaryKeyAccessor,
    insertNextPrimaryKeyAccessor
};