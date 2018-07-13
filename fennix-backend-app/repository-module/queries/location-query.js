const {locationDetails, locationCounter} = require('../models/beneficiary-location-model');
const selectCenterIdsForLoggedInUserAndSubUsersQuery = 'select distinct center_id, (select name from centers where center_id = u.center_id) as center_name from users u where user_id IN ';

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

const locationCounterQuery = () => {
    return locationCounter.find({})
};

const insertNextPrimaryKeyQuery = (req) => {
    locationCounter.update({_id: req}, {$inc: {counter: 1}}).then(doc => {
        if (!doc) {
            console.log('error');
        } else {
            console.log('success');
        }
    });
};

const locationDetailsUpdateQuery = (req) => {
    return locationDetails.insert({
        _id: req._id,
        beneficiaryId: req.beneficiaryId,
        deviceDate: req.deviceDate,
        latitude: req.latitude,
        longitude: req.longitude
    })
};

//SUPERVISOR & ADMIN
const selectCountryForSupervisorAndAdminQuery = 'select (select localized_text from localization where locale_key = loc.locale_key and language = $2) as country_name, loc.locale_key from location loc where location_id = (select location_id from users where user_id = $1) and location_level = 3';

//SUPER_ADMIN
const selectCountryForSuperAdminQuery = 'select (select localized_text from localization where locale_key = loc.locale_key and language = $2) as country_name, loc.locale_key from location loc where location_id IN (select location_id from users where owner_user_id = $1) and location_level = 3';

//MASTER_ADMIN
const selectAllCountriesForMasterAdminQuery = 'select (select localized_text from localization where locale_key = loc.locale_key and language = $2) as country_name, loc.locale_key from location loc where location_level = 3';

//OPERATOR
const selectCenterIdsForOperatorQuery = 'select c.location_id, (select name from centers where location_id = c.location_id) as location_name from location c where parent_location_id IN (select location_id from users where user_id = $1)';

//SUPERVISOR
const selectCenterIdsForSupervisorQuery = 'select c.location_id, (select name from centers where location_id = c.location_id) as location_name from location c where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from users where user_id = $1))';

//ADMIN
const selectCenterIdsForAdminQuery = 'select c.location_id, (select name from centers where location_id = c.location_id) as location_name from location c where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from users where user_id = $1)))';

//SUPER_ADMIN
const selectCenterIdsForSuperAdminQuery = 'select c.location_id, (select name from centers where location_id = c.location_id) as location_name from location c where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from location where parent_location_id IN (select location_id from users where user_id = $1))))';

//MASTER_ADMIN
const selectAllCenterIdsForMasterAdminQuery = 'select c.location_id, (select name from centers where location_id = c.location_id) as location_name from location c where location_level = 0';

const selectCenterIdsForGivenUserIdQuery = 'select location_id from location where parent_location_id = (select location_id from location where parent_location_id = (select location_id from users where user_id = $1))';


module.exports = {
    getBeneficiaryLocationList,
    selectCenterIdsForSupervisorQuery,
    selectCenterIdsForAdminQuery,
    selectCenterIdsForSuperAdminQuery,
    selectAllCenterIdsForMasterAdminQuery,
    selectCenterIdsForGivenUserIdQuery,
    selectCenterIdsForOperatorQuery,
    selectCountryForSupervisorAndAdminQuery,
    selectCountryForSuperAdminQuery,
    locationDetailsUpdateQuery,
    locationCounterQuery, insertNextPrimaryKeyQuery,
    selectAllCountriesForMasterAdminQuery,
    selectCenterIdsForLoggedInUserAndSubUsersQuery
};