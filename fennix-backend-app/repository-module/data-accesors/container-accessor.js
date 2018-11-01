const containerQueries = require('../queries/container-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {insertQueryCreator, requestInModifier, sortWithPaginationQueryCreator} = require('../../util-module/request-validators');
const {TABLE_CONTAINER} = require('../../util-module/db-constants');
const {updateQueryCreator} = require('../../util-module/request-validators');

const addContainerDetailsAccessor = async (req) => {
    let returnObj, finalResponse;
    finalResponse = await insertQueryCreator(req, TABLE_CONTAINER, containerQueries.addContainerDetailsQuery);
    console.log(finalResponse.modifiedInsertQuery);
    returnObj = await connectionCheckAndQueryExec(finalResponse.valuesArray, finalResponse.modifiedInsertQuery);
    return returnObj;
};

// const listContainersAccessor = async () => {
//     let returnObj;
//     returnObj = await connectionCheckAndQueryExec([], containerQueries.listContainersQuery);
//     return returnObj;
// };

const listContainersAccessor = async (req) => {
    let returnObj, modifiedQuery, finalQuery;
    modifiedQuery = requestInModifier(req.userIdList, containerQueries.listContainersQuery, false);
    console.log(modifiedQuery);
    finalQuery = `${modifiedQuery} ${sortWithPaginationQueryCreator(req.sortBy, 'desc', parseInt(req.skip,10), parseInt(req.limit,10))}`;
    console.log(finalQuery);
    returnObj = await connectionCheckAndQueryExec(req.userIdList, finalQuery);
    return returnObj;
};

const getTotalNoOfContainersAccessor = async (req) => {
    let returnObj, modifiedQuery;
    modifiedQuery = requestInModifier(req.userIdList, containerQueries.getTotalNoOfContainersQuery, false);
    returnObj = await connectionCheckAndQueryExec([req.userIdList], modifiedQuery);
    return returnObj;
};
const listUnAssignedContainersAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, containerQueries.listUnassignedContainersQuery);
    return returnObj;
};
const getContainerForDeviceIdAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, containerQueries.getContainerForDeviceIdQuery);
    return returnObj;
};

const updateContainerAccessor = async (req) => {
    let returnObj, updatedQueryCreatorResponse, fields = Object.keys(req), request = [];
    fields.sort();
    fields.splice(fields.indexOf('containerId'), 1);
    updatedQueryCreatorResponse = updateQueryCreator('container', fields, 'container_id');
    updatedQueryCreatorResponse.presentFields.forEach((f) => request.push(req[f]));
    request.push(req.containerId);
    returnObj = await connectionCheckAndQueryExec(request, updatedQueryCreatorResponse.query);
    return returnObj;
};
const getContainerIdListAccessor = async (req) => {
    let returnObj, extraQuery = 'order by $1 desc nulls last offset $2 limit $3', finalQuery;
    finalQuery = `${containerQueries.listContainersQuery} ${extraQuery}`;
    returnObj = await connectionCheckAndQueryExec(req, finalQuery);
    return returnObj;
};

const containerDeviceUpdateAccessor = async (data) => {
    let returnObj;
    returnObj = await containerQueries.updateLocationDeviceAttributeMasterQuery(req);
    return returnObj;
};

// const getContainerIdAccessor = async (data) => {
//     let returnObj;
//     returnObj = await containerQueries.updateLocationDeviceAttributeMasterQuery(req);
//     return returnObj;
// };
//
// const containerLocationUpdateAccessor = async (data) => {
//     let returnObj;
//     returnObj = await deviceQueries.updateLocationDeviceAttributeMasterQuery(req);
//     return returnObj;
// };

const containerLocationUpdateAccessor = async (data) => {
    let returnObj;
    returnObj = await containerQueries.insertElocksLocationQuery(data);
    return returnObj;
};

const containerDeviceAttributesUpdateAccessor = async (data) => {
    let returnObj;
    returnObj = await containerQueries.insertElocksDeviceAttributesQuery(data);
    return returnObj;
};

const fetchNextLocationPrimaryKeyAccessor = async () => {
    let returnObj;
    returnObj = await containerQueries.fetchNextLocationPrimaryKeyQuery();
    return returnObj;
};

const fetchNextDeviceAttributesPrimaryKeyAccessor = async () => {
    let returnObj;
    returnObj = await containerQueries.fetchNextDeviceAttributesPrimaryKeyQuery();
    return returnObj;
};

const updateElocksLocationDeviceAttributeMasterAccessor = async (req) => {
    let returnObj;
    returnObj = await containerQueries.updateElocksLocationDeviceAttributeMasterQuery(req);
    return returnObj;
};

const updateNextDeviceAttributesPrimaryKeyAccessor = async (req) => {
    let returnObj;
    returnObj = await containerQueries.updateNextDeviceAttributesPrimaryKeyQuery(req);
    return returnObj;
};
const updateNextLocationPrimaryKeyAccessor = async (req) => {
    let returnObj;
    returnObj = await containerQueries.updateNextLocationPrimaryKeyQuery(req);
    return returnObj;
};

module.exports = {
    updateNextLocationPrimaryKeyAccessor,
    updateNextDeviceAttributesPrimaryKeyAccessor,
    addContainerDetailsAccessor,
    listContainersAccessor,
    updateElocksLocationDeviceAttributeMasterAccessor,
    fetchNextDeviceAttributesPrimaryKeyAccessor,
    fetchNextLocationPrimaryKeyAccessor,
    getTotalNoOfContainersAccessor,
    getContainerIdListAccessor,
    listUnAssignedContainersAccessor,
    updateContainerAccessor,
    containerLocationUpdateAccessor,
    containerDeviceAttributesUpdateAccessor,
    // getContainerIdAccessor,
    getContainerForDeviceIdAccessor,
    containerDeviceUpdateAccessor
};
