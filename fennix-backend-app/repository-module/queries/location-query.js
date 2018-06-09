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

const selectCenterIdsForGivenUserIdQuery = 'select location_id from location where parent_location_id = (select location_id from location where parent_location_id = (select location_id from users where user_id = $1))';



module.exports = {
    getBeneficiaryLocationList,
    selectCenterIdsForGivenUserIdQuery
};
