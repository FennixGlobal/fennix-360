const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const deviceSchema = new Schema({
    _id: {Type: String},
    beneficiaryId: {Type: String},
    deviceTypeId: {Type: String},
    imei: {Type: String},
    simCardId: {Type: String},
    isActive: {Type: Boolean},
    online: {Type: String},
    centerId: {Type: String},
    firmwareVersion: {Type: String},
    createdDate: {Type: String},
    updatedDate: {Type: String}
});
var deviceAggregator = mongoose.model('Device', deviceSchema, 'devices');
module.exports = {
    deviceAggregator
};