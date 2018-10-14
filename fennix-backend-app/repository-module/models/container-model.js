const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);
let SchemaType = mongoose.Schema.Types;
const elocksLocationSchema = new Schema({
    _id: Number,
    containerId: String,
    deviceId: String,
    deviceDate: String,
    latitude:SchemaType.Double,
    longitude: SchemaType.Double
});

const elocksLocationCounterSchema = new Schema({counter:Number});

const elocksDeviceAttributesSchema = new Schema({
    gps: Number,
    direction: Number,
    mileage: Number,
    gpsQuality: Number,
    vehicleId: Number,
    deviceStatus: Number,
    geoFenceAlarm: Boolean,
    _id: Number,
    containerId: Number,
    deviceId: Number,
    cellId: Number,
    // mcc: Number,
    lac: String,
    // enableAlarmStatus: Boolean,
    // buzzerStatus: Boolean,
    // vibratorStatus: Boolean,
    // serialNumber: String,
    // hdop: Number,
    locationId: Number,
    speed: SchemaType.Double,
    gpsStatus: String,
    // moveDistance: Number,
    // alarmStatus: String,
    // beltStatus: Number,
    // batteryVoltage: SchemaType.Double,
    // shellStatus: Number,
    // chargeStatus: Number,
    // connectingSession: String,
    serverDate: Date,
    // course: Number,
    // satelliteNumber: Number,
    // gpsFixedStatus: Number,
    batteryPercentage: SchemaType.Double,
    // gsmSignal: Number,
    // lowPowerStatus: Number,
    // dataLoggerStatus: Number,
    // stillStatus: Number,
    // rfConnectionStatus: Number,
    // rfgSensorStatus: Number,
    // rfPlugStatus: Number,
    // restrictedAreaStatus: Number,
    // restrictedPersonsStatus: Number,
    deviceUpdatedDate: Date
});

const elocksDeviceAttributesCounterSchema = new Schema({
    _id: Schema.Types.ObjectId,
    counter: Number
});

const elocksDeviceSchema = new Schema({
    _id:  Number,
    containerId:  Number,
    deviceTypeId:  Number,
    imei:  Number,
    simCardId:  Number,
    active:  Boolean,
    online: String,
    centerId:  Number,
    firmwareVersion:  String,
    createdDate:  Date,
    updatedDate:  Date
});

const elocksDeviceTypeSchema = new Schema({
    _id: Number,
    name: String,
    minSpeed: Number,
    maxHdop: Number,
    minGpsLevel: Number,
    minDiffTrackPoints: Number,
    timeout: Number,
    stationaryTimeout: Number,
    icon: String,
    mapIcon: String,
    tailColor: String,
    tailPoints: Number,
    active: Boolean,
    createdDate: Date,
    updatedDate: Date
});


const ElocksLocationCounterModel = mongoose.model('ElocksLocationCounter',elocksLocationCounterSchema,'elocksLocationCounter');
const ElocksLocationModel = mongoose.model('ElocksLocation', elocksLocationSchema, 'elocksLocation');
const ElocksDeviceAttributeModel = mongoose.model('ElocksDeviceAttributes', elocksDeviceAttributesSchema, 'elocksDeviceAttributes');
const ElocksDeviceAttributesCounterModel = mongoose.model('ElocksDeviceAttributesCounter', elocksDeviceAttributesCounterSchema, 'elocksDeviceAttributesCounter');
const ElocksDeviceModel = mongoose.model('ElocksDevice', elocksDeviceSchema, 'elocksDevices');
const ElocksDeviceTypeModel = mongoose.model('ElocksDeviceType', elocksDeviceTypeSchema, 'elocksDeviceTypes');
const ElocksDeviceCounter = mongoose.model('ElocksDeviceCounter', elocksDeviceAttributesCounterSchema, 'elocksDevicesCounter');

module.exports = {
    ElocksLocationModel,
    ElocksLocationCounterModel,
    ElocksDeviceAttributeModel,
    ElocksDeviceAttributesCounterModel,
    ElocksDeviceModel,
    ElocksDeviceTypeModel
};