const dropbox = require('dropbox').Dropbox;
const {getDropdownValueByDropdownIdAccessor} = require('../../repository-module/data-accesors/common-accessor');
const dropBoxItem = new dropbox({
    accessToken: '6-m7U_h1YeAAAAAAAAAAV0CNy7fXzgtcE3i1PSumhkQaaW2QfdioPQEZGSq3VXbf',
    fetch: fetch
});

/**
 * @description Here we are having the image to be uploaded.We upload the image under these file category:
 * - PATJ / PATL-->Country-->DocumentID-->Profile-->Image
 * @param imageUpload
 * @param folderBasePath
 * @param folderName
 * @param createFolderFlag
 * @return {Promise<{folderBasePath: *, sharePath: *}>}
 */

const imageStorageBusiness = async (imageUpload, folderBasePath, folderName, createFolderFlag) => {
    let sharePath, fileUploadResponse;
    const profileResponse = createFolderFlag ? await createDropboxFolderBusiness(folderBasePath, 'profile') : {
        folderLocation: `${folderBasePath}/profile`,
        folderCreationFlag: true
    };
    if (notNullCheck(imageUpload) && profileResponse.folderCreationFlag) {
        fileUploadResponse = await uploadToDropboxBusiness(profileResponse.folderLocation, imageUpload, folderName);
        if (fileUploadResponse.uploadSuccessFlag) {
            sharePath = await shareDropboxLinkBusiness(fileUploadResponse.docUploadResponse.path_lower, true);
        }
    }
    return {sharePath, folderBasePath};
};

const shareDropboxLinkBusiness = async (dropboxPath, replaceLinkFlag) => {
    let sharePath,
        shareLink = await dropBoxItem.sharingCreateSharedLinkWithSettings({path: dropboxPath}).catch((err) => {
            console.log('sharing error');
            console.log(err);
        });
    let replaceLink = shareLink.url.split('\/s\/')[1];
    sharePath = replaceLinkFlag ? `https://dl.dropboxusercontent.com/s/${replaceLink}` : shareLink.url;
    return sharePath;
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

const getDropdownNameFromKeyBusiness = async (dropdownId) => {
    let dropdownResponse;
    dropdownResponse = await getDropdownValueByDropdownIdAccessor(dropdownId);
    return dropdownResponse;
};

const uploadToDropboxBusiness = async (documentPath, document, fileNameInit) => {
    console.log('upload to dropbox');
    console.log(documentPath);
    console.log(fileNameInit);
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
    console.log('upload dropbox response');
    console.log('file Name', fileName);
    if (notNullCheck(docUploadResponse)) {
        uploadSuccessFlag = true;
    }
    return {uploadSuccessFlag, docUploadResponse};
};

const dataURLtoFile = (dataurl) => {
    let newArray = dataurl.split(',')[1];
    return new Buffer(newArray, 'base64');
};

module.exports = {
    imageStorageBusiness,
};