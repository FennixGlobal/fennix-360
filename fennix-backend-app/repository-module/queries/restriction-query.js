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

const fetchLocationRestrictionQuery = (query) => {
    return LocationRestriction.find({$and: [{beneficiaryId: query}, {isActive: true}]});
};


const updateLocationRestrictionDetailsQuery = (req) => {
    return LocationRestriction.update({beneficiaryId: req.beneficiaryId},
        {
            $set: req
        },
        {
            upsert: true
        }).then(doc => {
        if (!doc) {
            console.log('error');
        } else {
            console.log('success');
        }
    })
};

module.exports = {
    updateLocationRestrictionDetailsQuery,
    addLocationRestrictionQuery,
    fetchNextPrimaryKeyQuery,
    fetchLocationRestrictionQuery
};