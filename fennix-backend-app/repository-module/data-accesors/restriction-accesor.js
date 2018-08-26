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

module.exports = {
    addLocationRestrictionAccessor,
    fetchLocRestrictionNextPrimaryKeyAccessor
};