const {userIdTicketAggregatorQuery} = require('../queries/ticket-query');
// const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
var ticketAggregator = async (req) => {
    let returnObj;
    returnObj = await userIdTicketAggregatorQuery(req);
    return returnObj;
};
module.exports = {
    ticketAggregator
};