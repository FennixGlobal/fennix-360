const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const simcardSchema = new Schema({
    _id: Number,
    centerId: String,
    deviceId: String,
    carrierByCountryId: String,
    simCardType: String,
    active: Boolean,
    phoneNo: String,
    serial: String,
    createdDate: String,
    updatedDate: String
});
const simcardTypeSchema = new Schema({
    _id: Number,
    simcardType: String
});

const simcardCounterSchema = new Schema({
    _id: Schema.Types.ObjectId,
    counter: Number
});

var simCardTypeModel = mongoose.model('SimcardTypes', simcardTypeSchema, 'simcardTypes');

var simcardDetails = mongoose.model('Simcards', simcardSchema, 'simcards');
var simcardCounterModel = mongoose.model('SimcardCounter', simcardCounterSchema, 'simcardsCounter');


module.exports = {
    simcardDetails,
    simCardTypeModel,
    simcardCounterModel
};