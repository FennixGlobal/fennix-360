const {getDeviceAttributeCounterQuery, updateDeviceAttributeQuery, updateDeviceCounterQuery, getDeviceDetailsByDeviceIdQuery, insertNextPrimaryKeyQuery, fetchNextPrimaryKeyQuery, insertDeviceQuery, userIdDeviceAggregatorQuery, deviceDetailsByBeneficiaryId, getDeviceDetailsForListOfBeneficiariesQuery, listDeviceTypesQuery, listDevicesQuery} = require('../queries/device-query');
const deviceAggregator = async (req) => {
    let returnObj;
    returnObj = await userIdDeviceAggregatorQuery(req);
    return returnObj;
};

const deviceBybeneficiaryQuery = async (req) => {
    let returnObj;
    returnObj = await deviceDetailsByBeneficiaryId(req);
    return returnObj;
};

const updateDeviceAttributesAccessor = async (req) => {
    let counterResponse = await getDeviceAttributeCounterQuery();
    req = {...req, _id: counterResponse[0]['counter']};
    console.log(req);
    updateDeviceAttributeQuery(req);
    updateDeviceCounterQuery(counterResponse[0]['_doc']['_id']);
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

const getDeviceByDeviceIdAccessor = async (req) => {
    let returnObj;
    returnObj = await getDeviceDetailsByDeviceIdQuery(req);
    return returnObj;
};


module.exports = {
    deviceAggregator,
    listDeviceTypesAccessor,
    deviceBybeneficiaryQuery,
    getDeviceDetailsForListOfBeneficiariesAccessor,
    listDevicesAccessor,
    insertDeviceAccessor,
    updateDeviceAttributesAccessor,
    fetchNextPrimaryKeyAccessor,
    insertNextPrimaryKeyAccessor,
    getDeviceByDeviceIdAccessor
};