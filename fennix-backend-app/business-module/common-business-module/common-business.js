const {fennixResponse, dropdownActionButtonCreator} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {imageDBLocation, imageLocalLocation} = require('../../util-module/connection-constants');
const {getDropdownAccessor, getImageCounterAccessor} = require('../../repository-module/data-accesors/common-accessor');
const {objectHasPropertyCheck, arrayNotEmptyCheck, notNullCheck} = require('../../util-module/data-validators');
const nodeMailer = require('nodemailer');
const {roleHTMLCreator, roleMailBody} = require('../../util-module/util-constants/fennix-email-html-conatants');
const fetch = require('isomorphic-fetch');
const dropbox = require('dropbox').Dropbox;
const dropBoxItem = new dropbox({
    accessToken: '6-m7U_h1YeAAAAAAAAAAV0CNy7fXzgtcE3i1PSumhkQaaW2QfdioPQEZGSq3VXbf',
    fetch: fetch
});

const dropDownBusiness = async (req) => {
    let request = [req.query.dropdownId, req.query.languageId], dropdownResponse,
        returnResponse = {dropdownList: [], isCommonDropdownFlag: true};
    dropdownResponse = await getDropdownAccessor(request);
    if (objectHasPropertyCheck(dropdownResponse, 'rows') && arrayNotEmptyCheck(dropdownResponse.rows)) {
        dropdownResponse.rows.forEach((item) => {
            returnResponse.dropdownList.push(dropdownActionButtonCreator(item));
        });
        returnResponse = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', returnResponse);
    } else {
        returnResponse = fennixResponse(statusCodeConstants.STATUS_NO_DROPDOWN, 'EN_US', []);
    }
    return returnResponse;
};

const imageStorageBusiness = async (imageUpload, id, country, role, date) => {
    let folderName, folderBasePath, sharePath, fileUploadResponse;
    folderName = `${role}_${id}_${date}`;
    folderBasePath = `/pat-j/${country}/${folderName}`;
    const profileResponse = await createDropboxFolderBusiness(folderBasePath, 'profile');
    if (notNullCheck(imageUpload) && profileResponse.folderCreationFlag) {
        fileUploadResponse = await uploadToDropboxBusiness(folderBasePath, imageUpload, folderName);
        // await dropBoxItem.filesCreateFolderV2({path: `${folderBasePath}/profile`})
        // && (notNullCheck(profileResponse) && objectHasPropertyCheck(profileResponse, 'metadata') && objectHasPropertyCheck(profileResponse['metadata'], 'path_lower')
        // fileFormat = imageUpload.match(/:(.*?);/)[1].split('/')[1];
        // imageUpload = dataURLtoFile(imageUpload);
        // const fileName = `${folderName}.${fileFormat}`;
        // let imageUploadResponse = await dropBoxItem.filesUpload({
        //     path: `${profileResponse['metadata']['path_lower']}/${fileName}`,
        //     contents: imageUpload
        // }).catch((err) => {
        //     console.log(err)
        // });
        if (fileUploadResponse.uploadSuccessFlag) {
            let shareLink = await dropBoxItem.sharingCreateSharedLinkWithSettings({path: fileUploadResponse.docUploadResponse.path_lower}).catch((err) => {
                console.log('sharing error');
                console.log(err);
            });
            let replaceLink = shareLink.url.split('\/s\/')[1];
            sharePath = `https://dl.dropboxusercontent.com/s/${replaceLink}`;
        }
    }
    return {sharePath, folderBasePath};
};
const createDropboxFolderBusiness = async (basePath, categoryFolder) => {
    let folderCreationFlag = false, folderLocation;
    const folderResponse = await dropBoxItem.filesCreateFolderV2({path: `${basePath}/${categoryFolder}`}).catch((err) => {
        console.log(err);
    });
    if (notNullCheck(folderResponse) && objectHasPropertyCheck(folderResponse, 'metadata') && objectHasPropertyCheck(folderResponse['metadata'], 'path_lower')) {
        folderCreationFlag = true;
        folderLocation = folderResponse['metadata']['path_lower'];
    }
    return {folderCreationFlag, folderLocation};
};

const uploadToDropboxBusiness = async (documentPath, document, fileNameInit) => {
    const fileFormat = document.match(/:(.*?);/)[1].split('/')[1];
    let documentUpload = document, docUploadResponse, uploadSuccessFlag = false;
    documentUpload = dataURLtoFile(documentUpload);
    const fileName = `${fileNameInit}.${fileFormat}`;
    docUploadResponse = await dropBoxItem.filesUpload({
        path: `${documentPath}/${fileName}`,
        contents: documentUpload
    }).catch((err) => {
        console.log(err)
    });
    if (notNullCheck(docUploadResponse)) {
        uploadSuccessFlag = true;
    }
    return {uploadSuccessFlag, docUploadResponse};
};

const dataURLtoFile = (dataurl) => {
    let newArray = dataurl.split(',')[1];
    return new Buffer(newArray, 'base64');
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
            // console.log(info);
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
    emailSendBusiness,
    createDropboxFolderBusiness,
    uploadToDropboxBusiness
};