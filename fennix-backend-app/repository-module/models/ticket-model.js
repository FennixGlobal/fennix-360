const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ticketSchema = new Schema({
    _id: {Type: String},
    userId: {Type: String},
    centerId: {Type: String},
    beneficiaryId: {Type: String},
    locationId: {Type: String},
    messages: [
        {
            userId: {Type: String},
            message: {Type: String},
            timestamp: {Type: String}
        }
    ],
    ticketStatus: {Type: String},
    withAlerts: {Type: Boolean},
    previousOwner: {Type: String},
    createdDate: {Type: String},
    updatedDate: {Type: String}
});
const ticketCounterSchema = new Schema({
    _id: Schema.Types.ObjectId,
    counter: Number
});

const TicketCounter = mongoose.model('TicketCounter', ticketCounterSchema, 'ticketsCounter');
var ticketAggregator = mongoose.model('Ticket',ticketSchema,'tickets');
module.exports = {
    ticketAggregator,
    TicketCounter
};