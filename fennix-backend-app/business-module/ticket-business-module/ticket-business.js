const {ticketAggregator} = require('../../repository-module/data-accesors/ticket-accesor');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

var ticketAggregatorDashboard = async (req) => {
    const request = {userId: req.query.userId};
    var returnObj = await ticketAggregator(request);
    return returnObj;
};

module.exports = {
    ticketAggregatorDashboard
}