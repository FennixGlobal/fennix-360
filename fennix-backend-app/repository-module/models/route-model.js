const mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

const companyRoutesSchema = new Schema({
    companyId: Number,
    companyAddress: addressSchema,
    primaryWarehouseAddress: addressSchema,
    primaryPortAddress: addressSchema,
    startAddress: addressSchema,
    endAddress: addressSchema,
    wayPoints: [addressSchema],
    stoppagePoints: [stoppagePointSchema]
});

const CompanyRouteModel = mongoose.model('companyRouteSchema', companyRoutesSchema, 'companyRoute');
module.exports = {
    CompanyRouteModel
};