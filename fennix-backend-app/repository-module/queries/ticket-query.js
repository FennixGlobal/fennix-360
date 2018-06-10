const {ticketAggregator} = require('../models/ticket-model');
const userIdTicketAggregatorQuery = (query) => {
    return ticketAggregator.aggregate([
        {
            $match: {
                "userId": query.userId
            }
        },
        {
            $group: {
                _id: "$ticketStatus",
                count: {$sum: 1}
            }
        }
    ]);
};

const userIdTicketDetailsBasedOnTicketStatusQuery = (query) => {
    return ticketAggregator.find(
        {
            "userId":query.userId,
            "centerId":query.centerId,
            "ticketStatus" : query.ticketStatus
        });
};

const listTicketsQuery = (query) => {
    return ticketAggregator.find(
        {
            "userId":query.userId
        }
    ).sort({"createdDate":-1})
        .skip(query.skip)
        .limit(query.limit);
};

module.exports = {
    userIdTicketAggregatorQuery,
    userIdTicketDetailsBasedOnTicketStatusQuery,
    listTicketsQuery
};