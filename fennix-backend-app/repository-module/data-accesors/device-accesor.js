const deviceQueries = require('../queries/device-query');

const deviceAggregator = async (req) => {
    let returnObj;
    returnObj = await deviceQueries.userIdDeviceAggregatorQuery(req);
    return returnObj;
};
const listUnAssignedDevicesAccessor = async (req) => {
    let returnObj;
    returnObj = await deviceQueries.listUnAssignedDevicesQuery(req);
    return returnObj;
};
const deviceBybeneficiaryQuery = async (req) => {
    let returnObj;
    returnObj = await deviceQueries.deviceDetailsByBeneficiaryId(req);
    return returnObj;
};

const updateDeviceAttributesAccessor = async (req) => {
    let counterResponse = await deviceQueries.getDeviceAttributeCounterQuery();
    req = {...req, _id: counterResponse['_doc']['counter']};
    deviceQueries.updateDeviceAttributeQuery(req);
    return counterResponse;
};

const getBeneficiaryIdByImeiAccessor = async (req) => {
    let returnObj;
    returnObj = await deviceQueries.getBeneficiaryIdByImeiQuery(req);
    return returnObj;
};

const updateLocationDeviceAttributeMasterAccessor = async (req) => {
    let returnObj;
    returnObj = await deviceQueries.updateLocationDeviceAttributeMasterQuery(req);
    return returnObj;
};

const getDeviceDetailsForListOfBeneficiariesAccessor = async (req) => {
    let returnObj;
    returnObj = await deviceQueries.getDeviceDetailsForListOfBeneficiariesQuery(req);
    return returnObj;
};

const listDevicesAccessor = async (req) => {
    let returnObj;
    returnObj = await deviceQueries.listDevicesQuery(req);
    return returnObj;
};

const listDeviceTypesAccessor = async () => {
    let returnObj;
    returnObj = await deviceQueries.listDeviceTypesQuery();
    return returnObj;
};

const insertDeviceAccessor = async (req) => {
    deviceQueries.insertDeviceQuery(req);
};

const fetchNextPrimaryKeyAccessor = async () => {
    let returnObj;
    returnObj = await deviceQueries.fetchNextPrimaryKeyQuery();
    return returnObj;
};


const getDeviceByDeviceIdAccessor = async (req) => {
    let returnObj;
    returnObj = await deviceQueries.getDeviceDetailsByDeviceIdQuery(req);
    return returnObj;
};

const getDeviceByBeneficiaryIdAccessor = async (req) => {
    let returnObj;
    returnObj = await deviceQueries.getDeviceDetailsByBeneficiaryIdQuery(req);
    return returnObj;
};

const updateDeviceWithBeneficiaryIdAccessor = async (req) => {
    let returnObj;
    returnObj = await deviceQueries.updateDeviceWithBeneficiaryIdQuery(req);
    return returnObj;
};

module.exports = {
    deviceAggregator,
    listDeviceTypesAccessor,
    deviceBybeneficiaryQuery,
    getDeviceDetailsForListOfBeneficiariesAccessor,
    listDevicesAccessor,
    insertDeviceAccessor,
    updateDeviceWithBeneficiaryIdAccessor,
    updateDeviceAttributesAccessor,
    fetchNextPrimaryKeyAccessor,
    getDeviceByDeviceIdAccessor,
    getBeneficiaryIdByImeiAccessor,
    getDeviceByBeneficiaryIdAccessor,
    listUnAssignedDevicesAccessor,
    updateLocationDeviceAttributeMasterAccessor
};
// deviceQueries.updateDeviceCounterQuery(counterResponse[0]['_doc']['_id']);
