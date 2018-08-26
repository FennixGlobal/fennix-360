const {LocationRestriction, LocationRestrictionCounter} = require('../models/restriction-model');

const addLocationRestrictionQuery = (req) => {
    let locationRestrictionObj = new LocationRestriction(req);
    locationRestrictionObj.save(function (err) {
        if (err) return console.error(err);
    });
};

const fetchNextPrimaryKeyQuery = () => {
    return LocationRestrictionCounter.findOneAndUpdate({}, {$inc:{counter:1}});
};
module.exports = {
    addLocationRestrictionQuery,
    fetchNextPrimaryKeyQuery
};