const {listUnAssignedSimcardsAccessor, listSimcardTypesAccessor, fetchNextPrimaryKeyAccessor, insertNextPrimaryKeyAccessor, addSimcardAccessor} = require('../../repository-module/data-accesors/sim-card-accessor');
const {fennixResponse, dropdownCreator} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {arrayNotEmptyCheck} = require('../../util-module/data-validators');

const listUnAssignedSimcardsBusiness = async (req) => {
    let response, request = {centerId: `${req.query.centerId}`}, finalResponse, modifiedResponse = [];
    response = await listUnAssignedSimcardsAccessor(request);
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
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_SIMCARDS_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

//TODO change response type login
const listSimcardTypesBusiness = async () => {
    let response, finalResponse, simcardTypeResponse = {dropdownList: []};
    response = await listSimcardTypesAccessor();
    if (arrayNotEmptyCheck(response)) {
        response.forEach((item) => {
            simcardTypeResponse.dropdownList.push(dropdownCreator(item['_id'], item['simcardType'], false));
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', simcardTypeResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_SIMCARD_TYPES_FOR_ID, 'EN_US', []);
    }
    return finalResponse;
};

const addSimcardBusiness = async (req) => {
    let request, primaryKeyResponse;
    primaryKeyResponse = await fetchNextPrimaryKeyAccessor();
    request = {
        _id: parseInt(primaryKeyResponse[0]['counter']),
        centerId: req.body.centerId,
        carrierByCountryId: req.body.carrierByCountryId,
        phoneNo: req.body.phoneNo,
        simCardType: req.body.simCardType,
        active: req.body.isActive,
        serial: req.body.serialNo
    };
    addSimcardAccessor(request);
    insertNextPrimaryKeyAccessor(primaryKeyResponse[0]['_doc']['_id']);
};


module.exports = {
    listUnAssignedSimcardsBusiness,
    listSimcardTypesBusiness,
    addSimcardBusiness
};