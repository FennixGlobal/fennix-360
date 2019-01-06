const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;
let SchemaType = mongoose.Schema.Types;

const addressSchema = {
    lat: SchemaType.Double,
    lng: SchemaType.Double,
    name: String
};

const stoppagePointSchema = {
    lat: SchemaType.Double,
    lng: SchemaType.Double,
    name: String,
    timeDuration: SchemaType.Double,
    timeUnit: String
};

const companyRoutesCounterSchema = new Schema({
    _id: Schema.Types.ObjectId,
    counter: Number
});

const companyRoutesSchema = new Schema({
    routeId: Number,
    companyId: Number,
    companyAddress: addressSchema,
    primaryWarehouseAddress: addressSchema,
    primaryPortAddress: addressSchema,
    startAddress: addressSchema,
    endAddress: addressSchema,
    wayPoints: [addressSchema],
    stoppagePoints: [stoppagePointSchema]
});
const CompanyRouteCounterModel = mongoose.model('companyRouteCounterSchema', companyRoutesCounterSchema, 'companyRouteCounter');
const CompanyRouteModel = mongoose.model('companyRouteSchema', companyRoutesSchema, 'companyRoute');
module.exports = {
    CompanyRouteModel,
    CompanyRouteCounterModel
};