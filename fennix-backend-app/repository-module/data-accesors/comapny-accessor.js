const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {insertQueryCreator,updateQueryCreator} = require('../../util-module/request-validators');
const {TABLE_COMPANY} = require('../../util-module/db-constants');
const companyQueries = require('../queries/company-query');

const addCompanyAccessor = async (req) => {
    let returnObj, finalResponse;
    finalResponse = await insertQueryCreator(req, TABLE_COMPANY, companyQueries.addCompanyQuery);
    returnObj = await connectionCheckAndQueryExec(finalResponse.valuesArray, finalResponse.modifiedInsertQuery);
    return returnObj;
};

const editCompanyAccessor = async (req) => {
    let returnObj, updatedQueryCreatorResponse, fields = Object.keys(req), request = [];
    fields.sort();
    fields.splice(fields.indexOf('companyId'), 1);
    updatedQueryCreatorResponse = updateQueryCreator(TABLE_COMPANY, fields, 'company_id');
    updatedQueryCreatorResponse.presentFields.forEach((f) => request.push(req[f]));
    request.push(req.companyId);
    returnObj = await connectionCheckAndQueryExec(request, updatedQueryCreatorResponse.query);
    return returnObj;
};

module.exports = {
    addCompanyAccessor,
    editCompanyAccessor
};