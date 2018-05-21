const {getBenefeciaryAggregator, getBeneficiaryListByOwnerId} = require('../../repository-module/data-accesors/beneficiary-accesor');
const {objectHasPropertyCheck,arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

var beneficiaryAggregatorDashboard = async (req) => {
    let request = [req.query.userId], beneficiaryResponse, returnObj;
    beneficiaryResponse = await getBenefeciaryAggregator(request);
    if (objectHasPropertyCheck(beneficiaryResponse,'rows') && arrayNotEmptyCheck(beneficiaryResponse.rows)) {
        let beneficiaryObj = {};
        if(beneficiaryResponse.rows.length === 1){
            let propName = beneficiaryResponse.rows[0]['role_name'];
            //TODO interchange victim and offender
            let propName2 = propName === 'VICTIM' ? 'VICTIM' : "OFFENDER";
            beneficiaryObj[propName] = beneficiaryResponse.rows[0]['count'];
            beneficiaryObj[propName2] = 0;
        } else {
            beneficiaryResponse.rows.forEach((item)=>{
                item['role_name'] =  item['role_name'] === 'VICTIM' ? 'OFFENDER' : "VICTIM";
                beneficiaryObj[item['role_name']] = item['count'];
            });
        }
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', beneficiaryObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

var beneficiaryListByOwnerUserId= async (req) => {
    let request = [req.query.userId, req.query.centerId], beneficiaryListResponse, returnObj;
    beneficiaryListResponse = await getBeneficiaryListByOwnerId(request);
    if (objectHasPropertyCheck(beneficiaryListResponse,'rows') && arrayNotEmptyCheck(beneficiaryListResponse.rows)) {
        let beneficiaryObj = {};
        beneficiaryObj['headerArray'] = Object.keys(beneficiaryListResponse.rows[0]).map(item => item);
        beneficiaryObj['bodyArray'] = beneficiaryListResponse.rows;

        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', beneficiaryObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};


module.exports = {
    beneficiaryAggregatorDashboard,
    beneficiaryListByOwnerUserId
};