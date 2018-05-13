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

module.exports = {
    userIdTicketAggregatorQuery
};