const restrictionQuery = require('../queries/restriction-query');

const addLocationRestrictionAccessor = async (req) => {
    let returnObj;
    returnObj = await restrictionQuery.addLocationRestrictionQuery(req);
    return returnObj;
};

const fetchLocRestrictionNextPrimaryKeyAccessor = async () => {
    let returnObj;
    returnObj = await restrictionQuery.fetchNextPrimaryKeyQuery();
    return returnObj;
};

const fetchLocationRestrictionAccessor = async (req) => {
    let returnObj;
    returnObj = await restrictionQuery.fetchLocationRestrictionQuery(req);
    return returnObj;
};


module.exports = {
    addLocationRestrictionAccessor,
    fetchLocationRestrictionAccessor,
    fetchLocRestrictionNextPrimaryKeyAccessor
};