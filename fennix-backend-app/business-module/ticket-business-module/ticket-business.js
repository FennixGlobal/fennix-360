const {ticketAggregator, ticketDetailsBasedOnTicketStatus} = require('../../repository-module/data-accesors/ticket-accesor');
const {notNullCheck,arrayNotEmptyCheck, objectHasPropertyCheck} = require('../../util-module/data-validators');
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

var ticketDetails = async (req) => {
    let request = {userId: req.query.userId,ticketStatus: req.query.ticketStatus, centerId: req.query.centerId}, ticketResponse, returnObj;
    ticketResponse = await ticketDetailsBasedOnTicketStatus(request);
    if (notNullCheck(ticketResponse) && arrayNotEmptyCheck(ticketResponse)) {
        // let ticketObj = {};
        // ticketResponse.forEach((item) => {
        //    ticketObj[item['_id']] = item['_doc'];
        // });
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', ticketResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_NO_TICKETS_FOR_USER_ID, 'en', []);
    }
    return returnObj;
};

module.exports = {
    ticketAggregatorDashboard,
    ticketDetails
}