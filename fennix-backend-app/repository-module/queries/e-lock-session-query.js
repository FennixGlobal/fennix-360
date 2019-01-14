const eLockModels = require('../models/e-lock-session-model');

const getELockSessionQuery = (eLockIdObj) => {
    return eLockModels.eLockSessionModel.find(eLockIdObj);
};
// TODO: Abhay Upsert it
const insertELockSessionQuery = (eLockObj) => {
    // return eLockModels.eLockSessionModel.collection.update(eLockObj, {upsert: true}, function (err, doc) {
    //     if (err) {
    //         return console.error(err);
    //     } else {
    //         return "Inserted elock trip data successfully";
    //     }
    // });
};

module.exports = {
    getELockSessionQuery,
    insertELockSessionQuery
};