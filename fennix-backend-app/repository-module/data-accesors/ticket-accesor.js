const {userIdTicketAggregatorQuery, userIdTicketDetailsBasedOnTicketStatusQuery,listTicketsQuery, ticketDetailsBasedOnTicketIdQuery} = require('../queries/ticket-query');

const ticketAggregatorAccessor = async (req) => {
    let returnObj;
    returnObj = await userIdTicketAggregatorQuery(req);
    return returnObj;
};

// const listTicketsBasedOnUserIdAccessor = async (req) => {
//     let returnObj;
//     returnObj = await listTicketsQuery(req);
//     return returnObj;
// };

const totalNoOfTicketsBasedOnUserIdAccessor = async (req) => {
    let returnObj;
    returnObj = await totalNoOfTicketsBasedOnUserIdQuery(req);
    return returnObj;
};

const ticketListBasedOnTicketStatusAccessor = async (req) => {
    let returnObj;
    returnObj = await userIdTicketDetailsBasedOnTicketStatusQuery(req);
    return returnObj;
};

const ticketDetailsBasedOnTicketIdAccessor = async (req) => {
  let returnObj;
  returnObj = await ticketDetailsBasedOnTicketIdQuery(req);
  return returnObj;
};

const listTicketsBasedOnUserIdAccessor = async (req) => {
    let returnObj;
    returnObj = await listTicketsQuery(req);
    return returnObj;
};

module.exports = {
    ticketAggregatorAccessor,
    ticketListBasedOnTicketStatusAccessor,
    listTicketsBasedOnUserIdAccessor,
    ticketDetailsBasedOnTicketIdAccessor
};