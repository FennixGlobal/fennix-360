const {notNullCheck, arrayNotEmptyCheck, objectHasPropertyCheck} = require('../../util-module/data-validators');
const {fetchUserProfileAccessor, addUserAccessor, getTotalRecordsForListUsersAccessor, updateUserAccessor, getUserListAccessor, updateUserProfileAccessor} = require('../../repository-module/data-accesors/user-accesor');
const {imageStorageBusiness, emailSendBusiness} = require('../common-business-module/common-business');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const STATUS_CODE_CONSTANTS = require('../../util-module/status-code-constants');
const FENNIX_CONSTANTS = require('../../util-module/util-constants/fennix-common-constants');
const {excelRowsCreator, excelColCreator} = require('../../util-module/request-validators');

const fetchUserDetailsBusiness = async (req) => {
    let request = [req.query.userId, req.query.languageId], userProfileResponse, returnObj;
    userProfileResponse = await fetchUserProfileAccessor(request);
    if (objectHasPropertyCheck(userProfileResponse, FENNIX_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(userProfileResponse.rows)) {
        let userProfileReturnObj = {};
        userProfileResponse.rows.forEach((item) => {
            userProfileReturnObj = {
                userName: `${item['first_name']} ${item['last_name']}`,
                mobileNo: item['mobile_no'],
                emailId: item['emailid'],
                center: item['center_name'],
                gender: item['gender'],
                image: item['image'],
                role: item['role'],
                userRole: item['role_name'],
                address: item['address'],
            };
        });
        returnObj = fennixResponse(STATUS_CODE_CONSTANTS.statusCodeConstants.STATUS_OK, 'EN_US', userProfileReturnObj);
    } else {
        returnObj = fennixResponse(STATUS_CODE_CONSTANTS.statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};

//TODO write the logic for this
const updateUserProfileBusiness = async (req) => {
    let request = [req.body.userId], userProfileResponse, returnObj;
    userProfileResponse = await updateUserProfileAccessor(request);
    if (notNullCheck(userProfileResponse) && arrayNotEmptyCheck(userProfileResponse)) {
        let ticketObj = {};
        userProfileResponse.forEach((item) => {
            ticketObj[item['_id']] = item['count'];
        });
        returnObj = fennixResponse(STATUS_CODE_CONSTANTS.statusCodeConstants.STATUS_OK, 'EN_US', ticketObj);
    } else {
        returnObj = fennixResponse(STATUS_CODE_CONSTANTS.statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};

const getUserListBusiness = async (req) => {
    let request = [req.query.userId, req.query.languageId, req.query.skip, req.query.limit], userProfileResponse,
        modifiedResponse = [],
        returnObj, totalRecordsResponse, finalResponse = {};
    userProfileResponse = await getUserListAccessor(request);
    totalRecordsResponse = await getTotalRecordsForListUsersAccessor([req.query.userId]);
    finalResponse[FENNIX_CONSTANTS.FENNIX_TOTAL_NUMBER_OF_RECORDS] = totalRecordsResponse.rows[0]['count'];
    if (objectHasPropertyCheck(userProfileResponse, FENNIX_CONSTANTS.FENNIX_ROWS) && arrayNotEmptyCheck(userProfileResponse.rows)) {
        userProfileResponse.rows.forEach((item) => {
            const obj = {
                userId: item['user_id'],
                roleId: item['role_id'],
                center: objectHasPropertyCheck(item, 'center') ? item['center'] : 'Center is not assigned',
                role: objectHasPropertyCheck(item, 'role') ? item['role'] : 'Role is not assigned',
                mobileNo: objectHasPropertyCheck(item, 'mobile_no') ? item['mobile_no'] : '-',
                email: objectHasPropertyCheck(item, 'email_id') ? item['email_id'] : '-',
                fullName: objectHasPropertyCheck(item, 'full_name') ? item['full_name'] : '-',
                image: item['image']
            };
            modifiedResponse.push(obj);
        });
        finalResponse['gridData'] = modifiedResponse;
        returnObj = fennixResponse(STATUS_CODE_CONSTANTS.statusCodeConstants.STATUS_OK, 'EN_US', finalResponse);
    } else {
        returnObj = fennixResponse(STATUS_CODE_CONSTANTS.statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};
const addUserBusiness = async (req) => {
    let request = req.body;
    request.image = await imageStorageBusiness(request.image, 'USER');
    request.updated_date = new Date();
    request.created_date = new Date();
    await addUserAccessor(request);
    emailSendBusiness(request.emailId, 'USER');
    return fennixResponse(STATUS_CODE_CONSTANTS.statusCodeConstants.STATUS_OK, 'EN_US', []);
};

const updateUserBusiness = async (req) => {
    let response, finalResponse;
    response = await updateUserAccessor(req);
    if (notNullCheck(response) && response['rowCount'] != 0) {
        finalResponse = fennixResponse(STATUS_CODE_CONSTANTS.statusCodeConstants.STATUS_OK, 'en', 'Updated user data successfully');
    } else {
        finalResponse = fennixResponse(STATUS_CODE_CONSTANTS.statusCodeConstants.STATUS_NO_USER_FOR_ID)
    }
    return finalResponse;
};

const deleteUserBusiness = async (req) => {
    let response, finalResponse;
    response = await updateUserAccessor(req);
    if (notNullCheck(response) && response['rowCount'] != 0) {
        finalResponse = fennixResponse(STATUS_CODE_CONSTANTS.statusCodeConstants.STATUS_OK, 'en', 'Deleted user data successfully');
    } else {
        finalResponse = fennixResponse(STATUS_CODE_CONSTANTS.statusCodeConstants.STATUS_NO_USER_FOR_ID)
    }
    return finalResponse;
};

const downloadUsersListBusiness = async (req) => {
    let request = [req.query.userId, req.query.languageId], userListResponse, colsKeysResponse, rowsIdsResponse,
        workbook = new Excel.Workbook(), modifiedResponse, keysArray, returnObj = {},
        sheet = workbook.addWorksheet('Beneficiary Sheet');
    colsKeysResponse = await excelColCreator([req.query.filterId]);
    sheet.columns = colsKeysResponse['cols'];
    keysArray = colsKeysResponse['keysArray'];
    userListResponse = await getUserListAccessor(request);
    rowsIdsResponse = excelRowsCreator(userListResponse, 'users', keysArray);
    returnObj = rowsIdsResponse[FENNIX_CONSTANTS.FENNIX_ROWS];
    modifiedResponse = Object.keys(returnObj).map(key => returnObj[key]);
    sheet.addRows(modifiedResponse);
    return workbook.xlsx.writeFile('/home/sindhura.gudarada/Downloads/users.xlsx');
};
module.exports = {
    addUserBusiness,
    updateUserProfileBusiness,
    getUserListBusiness,
    fetchUserDetailsBusiness,
    downloadUsersListBusiness,
    updateUserBusiness,
    deleteUserBusiness
};
