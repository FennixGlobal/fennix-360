const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const simcardSchema = new Schema({
    _id: {Type: String},
    centerId: {Type: String},
    deviceId: {Type: String},
    carrierByCountryId: {Type: String},
    simCardType: {Type: String},
    active: {Type: Boolean},
    phoneNo: {Type: String},
    serial: {Type: String},
    createdDate: {Type: String},
    updatedDate: {Type: String}
});
const simcardTypeSchema = new Schema({
    _id: Number,
    simcardType: String
});

var simCardTypeModel = mongoose.model('SimcardTypes', simcardTypeSchema, 'simcardTypes');

var simcardDetails = mongoose.model('Simcards', simcardSchema, 'simcards');

module.exports = {
    simcardDetails,
    simCardTypeModel
};