const {LocationRestriction, LocationRestrictionCounter} = require('../models/restriction-model');

const addLocationRestrictionQuery = (req) => {
    let locationRestrictionObj = new LocationRestriction(req);
    locationRestrictionObj.save(function (err) {
        if (err) return console.error(err);
    });
};

const fetchNextPrimaryKeyQuery = () => {
    return LocationRestrictionCounter.findOneAndUpdate({}, {$inc: {counter: 1}});
};

const fetchLocationRestrictionQuery = (query) => {
    return LocationRestriction.find({$and: [{beneficiaryId: query}, {isActive: true}]});
};


const updateLocationRestrictionDetailsQuery = (req, counter) => {
    console.log(req);
    return LocationRestriction.update(
        {_id:20 ,beneficiaryId:req.beneficiaryId},
        {
            $set: {
                // _id: 20,
                // primaryKeyResponse['_doc']['counter'],
                beneficiaryId: request['beneficiaryid'],
                restrictionName: request['mapTitle'],
                restrictionType: request['mapRestrictionType'],
                // startDate: request['startDate'],
                // finishDate: request['finishDate'],
                repeatRules: request['restrictionDays'],
                onAlert: request['onAlert'],
                isActive: true,
                locationDetails: request['mapLocation']
            }, $setOnInsert: {_id: 21}
            // req
            // $setOnInsert: {_id: counter}
        }, {upsert: true});

};

module.exports = {
    updateLocationRestrictionDetailsQuery,
    addLocationRestrictionQuery,
    fetchNextPrimaryKeyQuery,
    fetchLocationRestrictionQuery
};