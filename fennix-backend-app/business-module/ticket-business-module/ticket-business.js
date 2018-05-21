const {ticketAggregator} = require('../../repository-module/data-accesors/ticket-accesor');
const {notNullCheck,arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

var ticketAggregatorDashboard = async (req) => {
    let request = {userId: req.query.userId}, ticketResponse, returnObj;
    ticketResponse = await ticketAggregator(request);
    if (notNullCheck(ticketResponse) && arrayNotEmptyCheck(ticketResponse)) {
        let ticketObj = {};
        ticketResponse.forEach((item)=>{
           ticketObj[item['_id']] = item['count'];
        });
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', ticketObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

module.exports = {
    ticketAggregatorDashboard
};