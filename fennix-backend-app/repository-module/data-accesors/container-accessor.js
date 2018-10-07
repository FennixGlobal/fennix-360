const containerQueries = require('../queries/container-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {insertQueryCreator} = require('../../util-module/request-validators');
const {TABLE_CONTAINER} = require('../../util-module/db-constants');
const {updateQueryCreator} = require('../../util-module/request-validators');

const addContainerDetailsAccessor = async (req) => {
    let returnObj, finalResponse;
    finalResponse = insertQueryCreator(req, TABLE_CONTAINER, containerQueries.addContainerDetailsQuery);
    returnObj = await connectionCheckAndQueryExec(finalResponse.valuesArray, finalResponse.modifiedInsertQuery);
    return returnObj;
};

const listContainersAccessor = async () => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec([], containerQueries.listContainersQuery);
    return returnObj;
};

const getTotalNoOfContainersAccessor = async () => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec([], containerQueries.getTotalNoOfContainersQuery);
    return returnObj;
};

const listUnAssignedContainersAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, containerQueries.listUnassignedContainersQuery);
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

module.exports = {
    addContainerDetailsAccessor,
    listContainersAccessor,
    getTotalNoOfContainersAccessor,
    listUnAssignedContainersAccessor,
    updateContainerAccessor
};
