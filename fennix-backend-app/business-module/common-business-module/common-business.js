const {fennixResponse, dropdownCreator} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {getDropdownAccessor, getImageCounterAccessor, updateImageCounterAccessor} = require('../../repository-module/data-accesors/common-accessor');
const {objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');

const dropDownBusiness = async (req) => {
    let request = [req.query.dropdownId, req.query.languageId], dropdownResponse, returnResponse = {dropdownList: []};
    dropdownResponse = await getDropdownAccessor(request);
    if (objectHasPropertyCheck(dropdownResponse, 'rows') && arrayNotEmptyCheck(dropdownResponse.rows)) {
        dropdownResponse.rows.forEach((item) => {
            returnResponse.dropdownList.push(dropdownCreator(item['dropdown_id'], item['dropdown_value'], false));
        });
        returnResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', returnResponse);
    } else {
        returnResponse = fennixResponse(statusCodeConstants.STATUS_NO_DROPDOWN, 'EN_US', []);
    }
    return returnResponse;
};

const imageStorageBusiness = async (image, role) => {
    let returnLocation = '', imageCount, imageName, writeLocation = 'E:/DB/',
        mimeType = image.split(',')[0].split('/')[1].split(';')[0];
    image = image.split(',')[1];
    imageCount = await getImageCounterAccessor();
    await updateImageCounterAccessor();
    imageName = `${role}_${imageCount}.${mimeType}`;
    writeLocation = `${writeLocation}/${imageName}`;
    let bufferArray = new Buffer(image, 'base64');
    console.log(bufferArray);
    await fs.writeFile(writeLocation, bufferArray, (err, log) => {
        console.log(err);
        if (!err) {
            returnLocation = writeLocation;
        }
        console.log(log);
    });
    return returnLocation;
};

const emailSendBusiness = async (emailId, roleId) => {

};

module.exports = {
    dropDownBusiness,
    imageStorageBusiness,
    emailSendBusiness
};