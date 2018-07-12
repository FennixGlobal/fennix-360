const {listCarriersAccessor} = require('../../repository-module/data-accesors/carrier-accessor');
const {arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

const listCarrierBusiness = async () => {
    let response, finalResponse;
    response = await listCarriersAccessor();
    if (arrayNotEmptyCheck(response)) {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', response);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_CARRIERS_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

module.exports = {
    listCarrierBusiness
};