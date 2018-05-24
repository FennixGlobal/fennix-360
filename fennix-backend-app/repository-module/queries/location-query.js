const {locationDetails} = require('../models/beneficiary-location-model');

const getBeneficiaryLocationList = (query) => {
    return locationDetails.aggregate()
        .match({beneficiaryId: {$in: query}})
        .sort({"deviceDate": -1})
        .project({
            beneficiaryId: 1,
            latitude: 1,
            longitude: 1,
            locationId: 1
        })
        .group({
            _id: "$beneficiaryId",
            latestBeneficiaryLocation: {"$first": "$$CURRENT"}
        });
};
module.exports = {
    getBeneficiaryLocationList
};
