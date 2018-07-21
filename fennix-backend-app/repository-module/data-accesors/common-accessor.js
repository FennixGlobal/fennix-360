const {getDownloadMapperQuery,getDropdownDataQuery} = require('../queries/common-query');
const {imageCounterUpdateQuery,fetchImageCounterQuery} = require('../queries/common-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');

const getDownloadMapperAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, getDownloadMapperQuery);
    return returnObj;
};

const getDropdownAccessor = async (req) => {
    let responseObj;
    responseObj = await connectionCheckAndQueryExec(req, getDropdownDataQuery);
    return responseObj;
};

const getImageCounterAccessor = async ()=>{
    let responseObj;
    responseObj = await fetchImageCounterQuery();
    return responseObj;
};

const updateImageCounterAccessor = async ()=>{
    let responseObj;
    responseObj = await imageCounterUpdateQuery();
    return responseObj;
};

module.exports = {
    getDownloadMapperAccessor,
    getDropdownAccessor,
    getImageCounterAccessor,
    updateImageCounterAccessor
};