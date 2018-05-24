const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({
    _id: {Type: String},
    beneficiaryId: {Type: String},
    deviceId: {Type: String},
    deviceDate: {Type: String},
    latitude: {Type: Number},
    longitude: {Type: Number}
});
const locationDetails = mongoose.model('Location', locationSchema, 'location');
module.exports = {
    locationDetails
};