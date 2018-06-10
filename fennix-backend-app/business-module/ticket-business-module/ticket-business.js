const {listTicketsBasedOnUserIdAccessor, ticketAggregatorAccessor, ticketListBasedOnTicketStatusAccesor} = require('../../repository-module/data-accesors/ticket-accesor');
const {notNullCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

const ticketAggregatorBusiness = async (req) => {
    let request = {userId: req.query.userId}, ticketResponse, returnObj;
    ticketResponse = await ticketAggregatorAccessor(request);
    if (notNullCheck(ticketResponse) && arrayNotEmptyCheck(ticketResponse)) {
        let ticketObj = {
            RESOLVED: {key: 'resolvedTickets', value: '', color: '', legend: 'RESOLVED'},
            PENDING: {key: 'pendingTickets', value: '', color: '', legend: 'PENDING'},
            INPROGRESS: {key: 'activeTickets', value: '', color: '', legend: 'INPROGRESS'}
        };
        ticketResponse.forEach((item) => {
            ticketObj[item['_id']]['value'] = item['count'];
        });
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', ticketObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

var ticketListBasedOnStatusBusiness = async (req) => {
    let request = {userId: req.query.userId, ticketStatus: req.query.ticketStatus, centerId: req.query.centerId},
        ticketResponse, returnObj;
    ticketResponse = await ticketListBasedOnTicketStatusAccesor(request);
    if (notNullCheck(ticketResponse) && arrayNotEmptyCheck(ticketResponse)) {
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', ticketResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_NO_TICKETS_FOR_USER_ID, 'en', []);
    }
    return returnObj;
};

const listTicketsBusiness = async (req) => {
    let request = {
        userId: `${req.body.userId}`,
        skip: parseInt(req.body.pagination.currentPage) === 1 ? 0 : (parseInt(req.body.pagination.currentPage) * parseInt(req.body.pagination.pageSize)),
        limit: parseInt(req.body.pagination.pageSize)
    }, ticketResponse, returnObj;
    ticketResponse = await listTicketsBasedOnUserIdAccessor(request);
    if (notNullCheck(ticketResponse) && arrayNotEmptyCheck(ticketResponse)) {
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', ticketResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_NO_TICKETS_FOR_USER_ID, 'en', []);
    }
    return returnObj;
};

module.exports = {
    ticketAggregatorBusiness,
    ticketListBasedOnStatusBusiness,
    listTicketsBusiness
};
