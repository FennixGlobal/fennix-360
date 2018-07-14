const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);
const locationSchema = new Schema({
    _id: Number,
    beneficiaryId: String,
    deviceId: String,
    deviceDate: String,
    latitude: Double,
    longitude: Double
});

const locationCounterSchema = new Schema({counter:Number});
const locationCounter = mongoose.model('LocationCounter',locationCounterSchema,'locationCounter');
const locationDetails = mongoose.model('Location', locationSchema, 'location');
module.exports = {
    locationDetails,
    locationCounter
};