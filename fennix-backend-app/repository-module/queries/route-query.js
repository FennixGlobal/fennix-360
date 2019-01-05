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

module.exports = {
    insertCompanyRoutesQuery
};