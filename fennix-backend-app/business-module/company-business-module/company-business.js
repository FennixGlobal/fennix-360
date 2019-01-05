const companyAccessors = require('../../repository-module/data-accesors/comapny-accessor');
const {COMMON_CONSTANTS} = require('../../util-module/util-constants/fennix-common-constants');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

const addCompanyBusiness = async (req) => {
    let request = req.body, response;
    request.createdDate = new Date();
    request.createdBy = request.userId;
    request.isActive = true;
    response = await companyAccessors.addCompanyAccessor(request);
    console.log(response);
    if (objectHasPropertyCheck(response, COMMON_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(response.rows)) {

    }
    return fennixResponse(statusCodeConstants.STATUS_COMPANY_ADDED_SUCCESS, 'EN_US', []);
};

const editCompanyBusiness = async (req) => {
    let request = req.body, response, finalResponse;
    request.updatedBy = request.userId;
    request.updatedDate = new Date();
    response = await companyAccessors.editCompanyAccessor(request);
    if (notNullCheck(response) && response['rowCount'] !== 0) {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_COMPANY_EDIT_SUCCESS, 'EN_US', 'Updated company data successfully');
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_COMPANY_FOR_ID, 'EN_US', '');
    }
    return finalResponse;
};

const deleteCompanyBusiness = async (req) => {
    let request = req.body, response, finalResponse;
    return finalResponse;
};

const listCompanyBusiness = async (req) => {
    let request = req.body, response, finalResponse;
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
    sortCompanyBusiness
};