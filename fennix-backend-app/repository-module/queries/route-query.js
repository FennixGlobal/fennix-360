const {CompanyRouteModel, CompanyPrimaryAddressModel,CompanyRouteCounterModel} = require('../models/route-model');

const insertCompanyRoutesQuery = (req) => {
    let response = null;
    CompanyRouteModel.collection.insert(req, function (err, docs) {
        if (err) {
            console.error(err);
        } else {
            response = "Company routes documents inserted to Collection";
        }
    });
    return response;
};

const fetchAndUpdateCompanyRoutePrimaryKeyQuery = () => {
    return CompanyRouteCounterModel.findOneAndUpdate({}, {$inc: {counter: 1}});
};

const editCompanyRoutesQuery = (routeId, req) => {
    let response = null;
    CompanyRouteModel.update({
            routeId: routeId
        },
        {$set: req}).then(doc => {
        if (!doc) {
            console.log('error');
        } else {
            response = 'edited company route successfully';
        }
    });
    return response;
};
const insertCompanyPrimaryAddressQuery = (req) => {
    // let companyPrimaryAddressObj = new CompanyPrimaryAddressModel(req);
    CompanyPrimaryAddressModel.collection.insert(req, function (err, docs) {
        if (err) {
            return console.error(err);
        } else {
            return "company primary address data inserted to collection";
        }
    });
};

const getRouteByCompanyIdQuery = (req)=>{
    return CompanyRouteModel.find({companyId:req});
};

const getPrimaryAddressByCompanyIdQuery = (req) => {
    return CompanyPrimaryAddressModel.find({
        companyId: req,
        isActive: true
    });
};
const getRouteByRouteIdQuery = (req) => {
    return CompanyRouteModel.find({
        _id: req,
        isActive: true
    });
};

module.exports = {
    getRouteByRouteIdQuery,
    getPrimaryAddressByCompanyIdQuery,
    insertCompanyRoutesQuery,
    editCompanyRoutesQuery,
    getRouteByCompanyIdQuery,
    insertCompanyPrimaryAddressQuery,
    fetchAndUpdateCompanyRoutePrimaryKeyQuery
};