const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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

const deviceTypeSchema = new Schema({
    _id: {Type:String},
    name: {Type:String},
    minSpeed: {Type:Number},
    maxHdop: {Type:Number},
    minGpsLevel: {Type:Number},
    minDiffTrackPoints: {Type:Number},
    timeout: {Type:Number},
    stationaryTimeout: {Type:Number},
    icon: {Type:String},
    mapIcon: {Type:String},
    tailColor: {Type:String},
    tailPoints: {Type: Number},
    isActive: {Type:Boolean},
    createdDate: {Type:String},
    updatedDate: {Type:String}
});

const deviceAggregator = mongoose.model('Device', deviceSchema, 'devices');
const deviceTypeModel = mongoose.model('DeviceType', deviceTypeSchema, 'deviceTypes');

module.exports = {
    deviceAggregator,
    deviceTypeModel
};