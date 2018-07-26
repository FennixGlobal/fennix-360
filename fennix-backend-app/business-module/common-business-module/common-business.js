const {fennixResponse, dropdownCreator} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {imageDBLocation, imageLocalLocation} = require('../../util-module/connection-constants');
const {getDropdownAccessor, getImageCounterAccessor, updateImageCounterAccessor} = require('../../repository-module/data-accesors/common-accessor');
const {objectHasPropertyCheck, arrayNotEmptyCheck, notNullCheck} = require('../../util-module/data-validators');
const fs = require('fs');
const nodeMailer = require('nodemailer');
const {roleHTMLCreator, roleMailBody} = require('../../util-module/util-constants/fennix-email-html-conatants');

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
    let returnLocation = '', imageCount, imageName, writeLocation = imageDBLocation,
        mimeType;
    if (notNullCheck(image)) {
        mimeType = image.split(',')[0].split('/')[1].split(';')[0];
        image = image.split(',')[1];
        imageCount = await getImageCounterAccessor();
        await updateImageCounterAccessor();
        imageName = `${role}_${imageCount.counter}.${mimeType}`;
        writeLocation = `${writeLocation}${imageName}`;
        let bufferArray = new Buffer(image, 'base64');
        console.log(bufferArray);
        console.log(writeLocation);
        await fs.writeFile(writeLocation, bufferArray, (err, log) => {
            console.log(err);
            if (!err) {
                returnLocation = writeLocation;
            }
            console.log(log);
        });
    }
    return returnLocation;
};

const emailSendBusiness = async (emailId, roleId) => {
    const subject = 'Welcome to Fennix 360';
    let body;
    body = mailModifier(emailId, roleId);
    const transporter = nodeMailer.createTransport({
        port: 465,
        host: 'smtp.gmail.com',
        service: 'gmail',
        auth: {
            user: 'fennixtest@gmail.com',
            pass: 'Fennix@gmail'
        },
    });

    const mailOptions = {
        from: 'fennixtest@gmail.com',
        to: emailId,
        subject: subject,
        html: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(info);
        }
    });
};

const mailModifier = (email, roleName) => {
    let body, url, urlName, header, returnMailBody;
    url = `${roleMailBody[roleName.toLowerCase()].url}?emailId=${email}`;
    body = roleMailBody[roleName.toLowerCase()].body;
    urlName = roleMailBody[roleName.toLowerCase()].urlName;
    header = roleMailBody[roleName.toLowerCase()].header;
    returnMailBody = roleHTMLCreator(header, body, urlName, url);
    // console.log(returnMailBody);
    return returnMailBody;
};

module.exports = {
    dropDownBusiness,
    imageStorageBusiness,
    emailSendBusiness
};