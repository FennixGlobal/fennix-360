const containerQueries = require('../queries/container-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {insertQueryCreator} = require('../../util-module/request-validators');
const {TABLE_CONTAINER} = require('../../util-module/db-constants');

const addContainerDetailsAccessor = async (req) => {
    let returnObj, finalResponse;
    finalResponse = insertQueryCreator(req, TABLE_CONTAINER, containerQueries.addContainerDetailsQuery);
    returnObj = await connectionCheckAndQueryExec(finalResponse.valuesArray, finalResponse.modifiedInsertQuery);
    return returnObj;
};

module.exports = {
    addContainerDetailsAccessor
};