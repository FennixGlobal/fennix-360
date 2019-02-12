const searchAccessors = require('../../repository-module/data-accesors/search-accessor');
const {arrayNotEmptyCheck, responseObjectCreator} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

const searchBusiness = async (req) => {
    let request, response, modifiedResponse = {dropdownList: []}, finalResponse;
    response = await searchAccessors.searchAccessor({value: req.query.searchValue, tag: req.query.tag});
    if (arrayNotEmptyCheck(response)) {
        response.forEach((item) => {
            let obj = responseObjectCreator(item, ['dropdownKey', 'dropdownValue', 'tag'], ['value', 'value', 'tag']);
            modifiedResponse.dropdownList.push(obj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_DATA_FOR_GIVEN_SEARCH, 'EN_US', []);
    }
    return finalResponse;
};
const insertSearchBusiness = async (req) => {
    await searchAccessors.insertSearchAccessor(req);
};
module.exports = {
    searchBusiness,
    insertSearchBusiness
};
