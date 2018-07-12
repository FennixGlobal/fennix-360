const {getDownloadMapperQuery} = require('../queries/common-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');

const getDownloadMapperAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getDownloadMapperQuery);
    return returnObj;
};

module.exports = {
    getDownloadMapperAccessor
};