const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);
let SchemaType = mongoose.Schema.Types;

const eLockSessionSchema = new Schema({
    eLockId: Number,
    connectingIdAddress: String,
    connectingPort: String,
    connectingSocket: String,
    lastConnectionTime: Date,
    initialConnectionTime: Date
});

const eLockSessionModel = mongoose.model('eLockSession', eLockSessionSchema, 'eLockSessions');

module.exports = {
    eLockSessionModel
};