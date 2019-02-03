const searchAccessors = require('../../repository-module/data-accesors/search-accessor');
const {arrayNotEmptyCheck, responseObjectCreator} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const statusCodeConstants = require('../../util-module/status-code-constants');

const searchBusiness = async (req) => {
    let request, response, modifiedResponse = {dropdownList: []}, finalResponse;
    response = await searchAccessors.searchAccessor(req);
    if (arrayNotEmptyCheck(response)) {
        response.rows.forEach((item) => {
            let obj = responseObjectCreator(item, ['dropdownKey', 'dropdownValue', 'tag'], ['value', 'value', 'tag']);
            modifiedResponse.dropdownList.push(obj);
        });
        finalResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', modifiedResponse);
    } else {
        finalResponse = fennixResponse(statusCodeConstants.STATUS_NO_DATA_FOR_GIVEN_SEARCH, 'EN_US', []);
    }
    return finalResponse;
};

module.exports = {
    searchBusiness
};