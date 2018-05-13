const {deviceAggregator} = require('../../repository-module/data-accesors/device-accesor');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {getBeneficiaryByUserId} = require('../../repository-module/data-accesors/beneficiary-accesor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

var deviceAggregatorDashboard = async (req) => {
    const request = [req.query.userId];
    let beneficiaryResponse,returnObj;
    beneficiaryResponse = await getBeneficiaryByUserId(request);
    if(objectHasPropertyCheck(beneficiaryResponse,'rows') && arrayNotEmptyCheck(beneficiaryResponse.rows)){

    }
     = await deviceAggregator(request);
    return returnObj;
};

module.exports = {
    deviceAggregatorDashboard
}