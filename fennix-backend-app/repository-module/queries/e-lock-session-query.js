const eLockModels = require('../models/e-lock-session-model');

const getELockSessionQuery = (eLockIdObj) => {
    return eLockModels.eLockSessionModel.find(eLockIdObj);
};

const insertELockSessionQuery = (eLockObj) => {
    return eLockModels.eLockSessionModel.collection.insert(eLockObj, function (err, doc) {
        if (err) {
            return console.error(err);
        } else {
            return "Inserted elock trip data successfully";
        }
    });
};

module.exports = {
  getELockSessionQuery,
  insertELockSessionQuery
};