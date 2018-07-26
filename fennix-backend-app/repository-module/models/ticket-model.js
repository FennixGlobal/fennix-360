const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ticketSchema = new Schema({
    _id: Number,
    userId: Number,
    centerId: Number,
    beneficiaryId: Number,
    locationId: Number,
    messages: [
        {
            userId: Number,
            message: String,
            timestamp: Date
        }
    ],
    ticketStatus: String,
    withAlerts:Boolean,
    previousOwner: Number,
    createdDate: Date,
    updatedDate: Date
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