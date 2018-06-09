const {getBeneficiaryLocationList,selectCenterIdsForGivenUserIdQuery} = require('../queries/location-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');

const mapMarkerQuery = async (req) => {
    let returnObj;
    returnObj = await getBeneficiaryLocationList(req);
    return returnObj;
};

const getCenterIdsAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, selectCenterIdsForGivenUserIdQuery);
    return returnObj;
};

module.exports = {
    mapMarkerQuery,
    getCenterIdsAccessor
};
