var User = require('../models/user-model');

module.exports.getUserDetails = (req) => {
    return User.findOne({"password": req.password, $and: [{"userDetails.emailId": req.email}]}, function (err, doc) {});
};
