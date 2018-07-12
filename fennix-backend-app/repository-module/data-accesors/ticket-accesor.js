const ticketQuery = require('../queries/ticket-query');

const ticketAggregatorAccessor = async (req) => {
    let returnObj;
    returnObj = await ticketQuery.userIdTicketAggregatorQuery(req);
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
    returnObj = await ticketQuery.userIdTicketDetailsBasedOnTicketStatusQuery(req);
    return returnObj;
};

const ticketDetailsBasedOnTicketIdAccessor = async (req) => {
  let returnObj;
  returnObj = await ticketQuery.ticketDetailsBasedOnTicketIdQuery(req);
  return returnObj;
};

const listTicketsBasedOnUserIdAccessor = async (req) => {
    let returnObj;
    returnObj = await ticketQuery.listTicketsQuery(req);
    return returnObj;
};
const addTicketAccessor = async (req) => {
    let returnObj;
    returnObj = await ticketQuery.addTicketQuery(req);
    return returnObj;
};

const fetchNextPrimaryKeyAccessor = async () => {
    let returnObj;
    returnObj = await ticketQuery.fetchNextPrimaryKeyQuery();
    return returnObj;
};

const insertNextPrimaryKeyAccessor = async (req) => {
    await ticketQuery.insertNextPrimaryKeyQuery(req);
};

module.exports = {
    addTicketAccessor,
    ticketAggregatorAccessor,
    fetchNextPrimaryKeyAccessor,
    insertNextPrimaryKeyAccessor,
    ticketListBasedOnTicketStatusAccessor,
    listTicketsBasedOnUserIdAccessor,
    ticketDetailsBasedOnTicketIdAccessor
};