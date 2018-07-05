const {listSimcardsAccessor} = require('../../repository-module/data-accesors/sim-card-accessor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {arrayNotEmptyCheck} = require('../../util-module/data-validators');
const listSimcardsBusiness = async (req) => {
    let response, request = {centerId: `${req.query.centerId}`}, finalResponse, modifiedResponse = [];
    response = await listSimcardsAccessor(request);
    if (arrayNotEmptyCheck(response)) {
        response.forEach((item) => {
            let obj = {
                simCardId: item['_id'],
                number: item['phoneNo'],
                serialNo: item['serialNp'],
                isActive: item['isActive'],
                carrier: item['carrier']['name']
            };
            modifiedResponse.push(obj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'en', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_SIMCARDS_FOR_ID, 'en', []);
    }
    return finalResponse;
};

module.exports = {
    listSimcardsBusiness
};