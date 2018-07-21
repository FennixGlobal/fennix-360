const {notNullCheck, arrayNotEmptyCheck, objectHasPropertyCheck} = require('../../util-module/data-validators');
const {fetchUserProfileAccessor, addUserAccessor, getTotalRecordsForListUsersAccessor, getUserListAccessor, updateUserProfileAccessor} = require('../../repository-module/data-accesors/user-accesor');
const {imageStorageBusiness} = require('../common-business-module/common-business');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {statusCodeConstants} = require('../../util-module/status-code-constants');
const {excelRowsCreator, excelColCreator} = require('../../util-module/request-validators');

const fetchUserDetailsBusiness = async (req) => {
    let request = [req.query.userId, req.query.languageId], userProfileResponse, returnObj;
    userProfileResponse = await fetchUserProfileAccessor(request);
    if (objectHasPropertyCheck(userProfileResponse, 'rows') && arrayNotEmptyCheck(userProfileResponse.rows)) {
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
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', userProfileReturnObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
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
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', ticketObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};

const getUserListBusiness = async (req) => {
    let request = [req.query.userId, req.query.languageId, req.query.skip, req.query.limit], userProfileResponse,
        modifiedResponse = [],
        returnObj, totalRecordsResponse, finalResponse = {};
    userProfileResponse = await getUserListAccessor(request);
    totalRecordsResponse = await getTotalRecordsForListUsersAccessor([req.query.userId]);
    finalResponse['totalNoOfRecords'] = totalRecordsResponse.rows[0]['count'];
    if (objectHasPropertyCheck(userProfileResponse, 'rows') && arrayNotEmptyCheck(userProfileResponse.rows)) {
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
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', finalResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'EN_US', []);
    }
    return returnObj;
};
const addUserBusiness = async (req) => {
    let request = req.body;
    request.image = imageStorageBusiness(request.image);
    await addUserAccessor(request);
    return fennixResponse(statusCodeConstants.STATUS_OK, 'EN_US', []);
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
    returnObj = rowsIdsResponse['rows'];
    modifiedResponse = Object.keys(returnObj).map(key => returnObj[key]);
    sheet.addRows(modifiedResponse);
    return workbook.xlsx.writeFile('/home/sindhura.gudarada/Downloads/users.xlsx');
};
module.exports = {
    addUserBusiness,
    updateUserProfileBusiness,
    getUserListBusiness,
    fetchUserDetailsBusiness,
    downloadUsersListBusiness
};
