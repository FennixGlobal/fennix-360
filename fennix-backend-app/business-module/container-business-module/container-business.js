const containerAccessors = require('../../repository-module/data-accesors/container-accessor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

const addContainerDetailsBusiness = async (req) => {
    let request = req.body;
    request.createdDate = new Date();
    request.createdBy = request.userId;
    await containerAccessors.addContainerDetailsAccessor(request);
    return fennixResponse(statusCodeConstants.STATUS_CONTAINER_ADDED_SUCCESS, 'EN_US', []);
};

module.exports = {
    addContainerDetailsBusiness
};