var MetaData = require('../models/masterdata-model');

module.exports.getMetadata = (req) => {
    return MetaData.find({"emailId": req.emailId});
};
//