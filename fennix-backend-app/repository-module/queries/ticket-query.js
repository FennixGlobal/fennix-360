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

//TODO: sort based on updatedDate later after testing
const listTicketsQuery = (query) => {
    return ticketAggregator.aggregate().match(
        {
            "userId":query.userId
        }
    ).sort({"createdDate":-1})
        .skip(query.skip)
        .limit(query.limit)
        .lookup(
            {
                from:"devices",
                localField:"beneficiaryId",
                foreignField:"beneficiaryId",
                as:"device"
            }
        )
        .lookup(
            {
                from:"deviceTypes",
                localField:"device.deviceTypeId",
                foreignField:"_id",
                as:"deviceType"
            }
        )
        .project(
            {
                "beneficiaryId" : 1,
                "userId" : 1,
                "device.imei":1,
                "locationId" : 1,
                "withAlerts" : 1,
                "ticketName":1,
                "alertType":1,
                "deviceType.name":1,
                "readStatus":1,
                "createdDate":1,
                "updatedDate":1
            }
        );
};

const ticketDetailsBasedOnTicketIdQuery = (query) => {
    return ticketAggregator.find(
        {
            "_id" : query.ticketId
        }
    );
};
module.exports = {
    userIdTicketAggregatorQuery,
    userIdTicketDetailsBasedOnTicketStatusQuery,
    listTicketsQuery,
    ticketDetailsBasedOnTicketIdQuery
};