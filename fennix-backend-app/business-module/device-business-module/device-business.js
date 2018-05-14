const {deviceAggregator} = require('../../repository-module/data-accesors/device-accesor');
const {notNullCheck,objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {getBeneficiaryByUserId} = require('../../repository-module/data-accesors/beneficiary-accesor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

var deviceAggregatorDashboard = async (req) => {
    const request = [req.query.userId];
    let beneficiaryResponse,deviceResponse, returnObj;
    beneficiaryResponse = await getBeneficiaryByUserId(request);
    if (objectHasPropertyCheck(beneficiaryResponse, 'rows') && arrayNotEmptyCheck(beneficiaryResponse.rows)) {
        let deviceArray = [];
        beneficiaryResponse.rows.forEach((item) => {
           deviceArray.push(`${item.beneficiaryid}`);
        });
        deviceResponse = await deviceAggregator(deviceArray);
    }
    if(notNullCheck(deviceResponse)){
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK,'en',deviceResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED,'en',[]);
    }
    return returnObj;
};

module.exports = {
    deviceAggregatorDashboard
}