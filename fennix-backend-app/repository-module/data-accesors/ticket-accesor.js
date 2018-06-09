const {userIdTicketAggregatorQuery, userIdTicketDetailsBasedOnTicketStatusQuery} = require('../queries/ticket-query');

const ticketAggregator = async (req) => {
    let returnObj;
    returnObj = await userIdTicketAggregatorQuery(req);
    return returnObj;
};

const ticketDetailsBasedOnTicketStatus = async (req) => {
    let returnObj;
    returnObj = await userIdTicketDetailsBasedOnTicketStatusQuery(req);
    return returnObj;
};

module.exports = {
    ticketAggregator,
    ticketDetailsBasedOnTicketStatus
};