const companyAccessors = require('../../repository-module/data-accesors/comapny-accessor');
const routeBusiness = require('../route-business-module/route-business');
const COMMON_CONSTANTS = require('../../util-module/util-constants/fennix-common-constants');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {fennixResponse, dropdownCreator} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {getUserIdsForAllRolesAccessor} = require('../../repository-module/data-accesors/user-accesor');
const {objectHasPropertyCheck, arrayNotEmptyCheck, notNullCheck, deviceStatusMapper} = require('../../util-module/data-validators');

const addCompanyBusiness = async (req) => {
    let request = req.body, response, routeResponse, finalResponse;
    request.createdDate = new Date();
    request.createdBy = request.userId;
    request.isActive = true;
    response = await companyAccessors.addCompanyAccessor(request);
    if (objectHasPropertyCheck(response, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(response.rows)) {
        console.log(response.rows);
        request.companyId = response.rows[0]['company_id'];
        routeResponse = await routeBusiness.insertCompanyRouteBusiness(request);
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
/*
const listCompanyBusiness = async (req) => {
    let response, finalResponse, modifiedResponse = {gridData: []};
    response = await companyAccessors.listCompanyAccessor([req.query.languageId, req.query.userId, parseInt(req.query.skip), parseInt(req.query.limit)]);
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
        modifiedResponse.totalNoOfRecords = response.rows.length;
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_COMPANY_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};
*/

const listCompanyBusiness = async (req) => {
    let response, finalResponse, modifiedResponse = {gridData: []};
    // request = {languageId: req.query.languageId, skip: parseInt(req.query.skip), limit: parseInt(req.query.limit)};
    response = await commonListDropdownBusiness(req, req.query.languageId, parseInt(req.query.skip), parseInt(req.query.limit));
    if (arrayNotEmptyCheck(response.data)) {
        modifiedResponse.totalNoOfRecords = response.totalNoOfRecords;
        modifiedResponse.gridData = [...response.data];
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_COMPANY_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
    // request.userIdList = await getUserIdsForAllRolesAccessor(req, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID);
    // response = await companyAccessors.listCompanyAccessor(request);
    // if (objectHasPropertyCheck(response, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(response.rows)) {
    //     response.rows.forEach((item) => {
    //         let obj = {
    //             companyId: item['company_id'],
    //             companyName: item['company_name'],
    //             companyType: item['company_type'],
    //             customsId: item['customs_id']
    //         };
    //         modifiedResponse.gridData.push(obj);
    //     });
};

const listCompanyDropdownBusiness = async (req) => {
    let response, finalResponse, modifiedResponse = {dropdownList: []};
    response = await commonListDropdownBusiness(req, req.query.languageId);
    if (arrayNotEmptyCheck(response.data)) {
        response.data.forEach(item => {
            modifiedResponse.dropdownList.push(dropdownCreator(item['companyId'], item['companyName'], false));
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_COMPANY_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

const commonListDropdownBusiness = async (req, languageId, skip = null, limit = null) => {
    let response, modifiedResponse = {data: [], totalNoOfRecords: 0},
        request = skip && limit ? {languageId, skip, limit} : {languageId};
    console.log(request);
    request.userIdList = await getUserIdsForAllRolesAccessor(req, COMMON_CONSTANTS.FENNIX_USER_DATA_MODIFIER_USER_USERID);
    response = await companyAccessors.listCompanyAccessor(request);
    if (objectHasPropertyCheck(response, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(response.rows)) {
        response.rows.forEach((item) => {
            let obj = {
                companyId: item['company_id'],
                companyName: item['company_name'],
                companyType: item['company_type'],
                customsId: item['customs_id']
            };
            modifiedResponse.data.push(obj);
        });
        modifiedResponse.data.sort((prev, next) => prev.companyId - next.companyId);
        modifiedResponse.totalNoOfRecords = response.rows.length;
    }
    return modifiedResponse;
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

const getCompanyDetailsBusiness = async (req) => {
    let request = [req.query.companyId], response, modifiedResponse = [], finalResponse;
    response = await companyAccessors.getCompanyDetailsAccessor(request);
    if (objectHasPropertyCheck(response, 'rows') && arrayNotEmptyCheck(response.rows)) {
        response.rows.forEach((item) => {
            let obj = {
                companyId: item['company_id'],
                companyName: item['company_name'],
                companyType: item['company_type'],
                companyAddress: item['company_address'],
                companyPhone: item['company_phone'],
                companyEmail: item['company_email'],
                companyState: item['company_state'],
                companyCity: item['company_city'],
                companyCountry: item['company_country'],
                customsId: item['customs_id']
            };
            modifiedResponse.push(obj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_COMPANY_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
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
    sortCompanyBusiness,
    listCompanyDropdownBusiness,
    getCompanyDetailsBusiness
};
