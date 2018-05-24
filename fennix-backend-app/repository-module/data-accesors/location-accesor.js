

const {getBeneficiaryLocationList} = require('../queries/location-query');
// const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
var mapMarkerQuery = async (req) => {
    let returnObj;
    returnObj = await getBeneficiaryLocationList(req);
    return returnObj;
};
module.exports = {
    mapMarkerQuery
};
