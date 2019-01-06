const {CompanyRouteModel} = require('../models/route-model');

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
    return CompanyRouteModel.findOneAndUpdate({}, {$inc: {counter: 1}});
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


module.exports = {
    insertCompanyRoutesQuery,
    editCompanyRoutesQuery,
    fetchAndUpdateCompanyRoutePrimaryKeyQuery
};