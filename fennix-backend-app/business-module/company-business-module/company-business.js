const companyAccessors = require('../../repository-module/data-accesors/comapny-accessor');
const routeBusiness = require('../route-business-module/route-business');
const COMMON_CONSTANTS = require('../../util-module/util-constants/fennix-common-constants');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {objectHasPropertyCheck, arrayNotEmptyCheck, notNullCheck, deviceStatusMapper} = require('../../util-module/data-validators');

const addCompanyBusiness = async (req) => {
    let request = req.body, response, routeResponse, finalResponse;
    request.createdDate = new Date();
    request.createdBy = request.userId;
    request.isActive = true;
    response = await companyAccessors.addCompanyAccessor(request);
    // console.log(response);
    if (objectHasPropertyCheck(response, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(response.rows)) {
        // routeResponse = await routeBusiness.insertCompanyRouteBusiness(req);
        if (notNullCheck(routeResponse)) {
            finalResponse = fennixResponse(statusCodeConstants.STATUS_COMPANY_ADDED_SUCCESS, 'EN_US', []);
            console.log('added company route successfully');
        } else {
            finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_COMPANY_FOR_ID, 'EN_US', []);
            console.log('error while adding company routes');
        }
    }
    return finalResponse;
};
const listCompanyBusiness = async (req) => {
    let response, finalResponse, modifiedResponse = {gridData: []};
    response = await companyAccessors.listCompanyAccessor([req.query.languageId, req.query.userId]);
    if (objectHasPropertyCheck(response, 'rows') && arrayNotEmptyCheck(response.rows)) {
        response.rows.forEach((item) => {
            let obj = {
                companyId: item['company_id'],
                companyName: item['company_name'],
                companyType: item['company_type'],
                customsId: item['customs_id']
            };
            modifiedResponse.gridData.push(obj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_COMPANY_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

const editCompanyBusiness = async (req) => {
    let request = req.body, response, finalResponse, routeResponse;
    request.updatedBy = request.userId;
    request.updatedDate = new Date();
    response = await companyAccessors.editCompanyAccessor(request);
    routeResponse = await routeBusiness.editCompanyRoutesBusiness(req);
    if (notNullCheck(response) && response['rowCount'] !== 0 && notNullCheck(routeResponse)) {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_COMPANY_EDIT_SUCCESS, 'EN_US', 'Updated company data successfully');
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_COMPANY_FOR_ID, 'EN_US', '');
    }
    return finalResponse;
};

const deleteCompanyBusiness = async (req) => {
    let request = {companyId: req.body.companyId, isActive: false, updatedBy: req.body.userId, updatedDate: new Date()};
    await companyAccessors.editCompanyAccessor(request);
    await routeBusiness.deleteCompanyRoutesBusiness(req);
    return fennixResponse(statusCodeConstants.STATUS_OK, 'EN', 'Deleted company & route successfully');
};


const sortCompanyBusiness = async (req) => {
    let request = req.body, response, finalResponse;
    return finalResponse;
};

module.exports = {
    addCompanyBusiness,
    editCompanyBusiness,
    deleteCompanyBusiness,
    listCompanyBusiness,
    sortCompanyBusiness
};
