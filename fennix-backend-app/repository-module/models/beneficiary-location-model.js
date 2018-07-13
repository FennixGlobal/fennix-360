const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({
    _id: String,
    beneficiaryId: String,
    deviceId: String,
    deviceDate: String,
    latitude: Number,
    longitude: Number
});

const locationCounterSchema = new Schema({counter:Number});
const locationCounter = mongoose.model('Location',locationCounterSchema,'locationCounter');
const locationDetails = mongoose.model('Location', locationSchema, 'location');
module.exports = {
    locationDetails,
    locationCounter
};