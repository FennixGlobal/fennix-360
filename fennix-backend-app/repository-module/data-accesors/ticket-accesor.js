const {userIdTicketAggregatorQuery, userIdTicketDetailsBasedOnTicketStatusQuery} = require('../queries/ticket-query');
// const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
var ticketAggregator = async (req) => {
    let returnObj;
    returnObj = await userIdTicketAggregatorQuery(req);
    return returnObj;
};

var ticketDetailsBasedOnTicketStatus = async (req) => {
    let returnObj;
    returnObj = await userIdTicketDetailsBasedOnTicketStatusQuery(req);
    return returnObj;
};

module.exports = {
    ticketAggregator,
    ticketDetailsBasedOnTicketStatus
};