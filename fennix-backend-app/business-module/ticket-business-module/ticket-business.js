const {listTicketsBasedOnUserIdAccessor,insertNextPrimaryKeyAccessor,addTicketAccessor,fetchNextPrimaryKeyAccessor, totalNoOfTicketsBasedOnUserIdAccessor, ticketAggregatorAccessor, ticketListBasedOnTicketStatusAccessor, ticketDetailsBasedOnTicketIdAccessor} = require('../../repository-module/data-accesors/ticket-accesor');
const {getBeneficiaryNameFromBeneficiaryIdAccessor} = require('../../repository-module/data-accesors/beneficiary-accesor');
const {notNullCheck, objectHasPropertyCheck, arrayNotEmptyCheck} = require('../../util-module/data-validators');
const {getUserNameFromUserIdAccessor, getUserIdsForAdminAccessor, getUserIdsForMasterAdminAccessor, getUserIdsForSuperAdminAccessor, getUserIdsForSupervisorAccessor} = require('../../repository-module/data-accesors/user-accesor');
const {fennixResponse} = require('../../util-module/custom-request-reponse-modifiers/response-creator');
const {getUserIdsForAllRolesAccessor} = require('../../repository-module/data-accesors/user-accesor');
const {statusCodeConstants} = require('../../util-module/status-code-constants');

const ticketAggregatorBusiness = async (req) => {
    let request = {}, ticketResponse, returnObj, userIdList;
    userIdList = await getUserIdsForAllRolesAccessor(req);
    request.userIds = userIdList;
    ticketResponse = await ticketAggregatorAccessor(request);
    if (notNullCheck(ticketResponse) && arrayNotEmptyCheck(ticketResponse)) {
        let ticketObj = {
            RESOLVED: {key: 'resolvedTickets', value: '', color: '', legend: 'RESOLVED'},
            PENDING: {key: 'pendingTickets', value: '', color: '', legend: 'PENDING'},
            INPROGRESS: {key: 'activeTickets', value: '', color: '', legend: 'ACTIVE'}
        };
        ticketResponse.forEach((item) => {
            ticketObj[item['_id']]['value'] = item['count'];
        });
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', ticketObj);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_USER_RETIRED, 'en', []);
    }
    return returnObj;
};

const ticketListBasedOnStatusBusiness = async (req) => {
    let request = {userId: req.query.userId, ticketStatus: req.query.ticketStatus, centerId: req.query.centerId},
        ticketResponse, returnObj;
    ticketResponse = await ticketListBasedOnTicketStatusAccessor(request);
    if (notNullCheck(ticketResponse) && arrayNotEmptyCheck(ticketResponse)) {
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', ticketResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_NO_TICKETS_FOR_USER_ID, 'en', []);
    }
    return returnObj;
};

const listTicketsBusiness = async (req) => {
    let request = {userId: req.query.userId, skip: parseInt(req.query.skip), limit: parseInt(req.query.limit)},
        ticketResponse, modifiedResponse = {gridData: []}, beneficiaryIds = [], beneficiaryIdNameMap = {}, returnObj,
        userDetailsResponse, beneficiaryResponse, otherUserDetailResponse, userDetailMap = {}, userIds = [];
    userDetailsResponse = await getUserNameFromUserIdAccessor([req.query.languageId, req.query.userId]);

    if (objectHasPropertyCheck(userDetailsResponse, 'rows') && arrayNotEmptyCheck(userDetailsResponse.rows)) {
        switch (userDetailsResponse.rows[0]['native_user_role'].toUpperCase()) {
            case 'ROLE_SUPERVISOR' : {
                otherUserDetailResponse = await getUserIdsForSupervisorAccessor([userDetailsResponse.rows[0]['user_id'], req.query.languageId]);
                break;
            }
            case 'ROLE_ADMIN' : {
                otherUserDetailResponse = await getUserIdsForAdminAccessor([userDetailsResponse.rows[0]['user_id'], req.query.languageId]);
                break;
            }
            case 'ROLE_SUPER_ADMIN' : {
                otherUserDetailResponse = await getUserIdsForSuperAdminAccessor([userDetailsResponse.rows[0]['user_id'], req.query.languageId]);
                break;
            }
            case 'ROLE_MASTER_ADMIN' : {
                otherUserDetailResponse = await getUserIdsForMasterAdminAccessor([userDetailsResponse.rows[0]['user_id'], req.query.languageId]);
                break;
            }
        }
        if (objectHasPropertyCheck(otherUserDetailResponse, 'rows') && arrayNotEmptyCheck(otherUserDetailResponse.rows)) {
            otherUserDetailResponse.rows.forEach((item) => {
                const userDetailsObj = {
                    fullName: item['full_name'],
                    role: item['role_name'],
                    roleId: item['user_role'],
                    gender: item['gender']
                };
                userDetailMap[item['user_id']] = userDetailsObj;
                userIds.push(`${item['user_id']}`);
            });
        }
    };
    request.userId = userIds;
    ticketResponse = await listTicketsBasedOnUserIdAccessor(request);
    ticketResponse.forEach((item) => {
        if (beneficiaryIds.indexOf(item['beneficiaryId']) === -1) {
            beneficiaryIds.push(parseInt(item['beneficiaryId']));
        }
    });
    beneficiaryResponse = await getBeneficiaryNameFromBeneficiaryIdAccessor(beneficiaryIds, req.query.languageId);
    if (objectHasPropertyCheck(beneficiaryResponse, 'rows') && arrayNotEmptyCheck(beneficiaryResponse.rows)) {
        beneficiaryResponse.rows.forEach((item) => {
            const beneficiaryObj = {
                fullName: item['full_name'],
                role: item['role_name'],
                roleId: item['beneficiary_role'],
                gender: item['gender']
            };
            beneficiaryIdNameMap[item['beneficiaryid']] = beneficiaryObj;
        });
    }
    if (arrayNotEmptyCheck(ticketResponse)) {
        ticketResponse.forEach((item) => {
            const obj = {
                ticketId: item['_id'],
                ticketName: notNullCheck(item['ticketName']) ? item['ticketName'] : 'Ticket Header',

                // userName: userDetailsResponse.rows[0]['full_name'],
                // userRole: userDetailsResponse.rows[0]['role_name'],
                // userRoleId: userDetailsResponse.rows[0]['user_role'],
                // userGender: userDetailsResponse.rows[0]['gender'],
                userName: userDetailMap[item['userId']]['fullName'],
                userRole: userDetailMap[item['userId']]['role'],
                userRoleId: userDetailMap[item['userId']]['roleId'],
                userGender: userDetailMap[item['userId']]['gender'],

                beneficiaryId: item['beneficiaryId'],
                beneficiaryRoleId: objectHasPropertyCheck(beneficiaryIdNameMap, parseInt(item['beneficiaryId'])) ? beneficiaryIdNameMap[parseInt(item['beneficiaryId'])]['roleId'] : null,
                beneficiaryName: objectHasPropertyCheck(beneficiaryIdNameMap, parseInt(item['beneficiaryId'])) ? beneficiaryIdNameMap[parseInt(item['beneficiaryId'])]['fullName'] : ' - ',
                beneficiaryRole: objectHasPropertyCheck(beneficiaryIdNameMap, parseInt(item['beneficiaryId'])) ? beneficiaryIdNameMap[parseInt(item['beneficiaryId'])]['role'] : ' - ',
                beneficiaryGender: objectHasPropertyCheck(beneficiaryIdNameMap, parseInt(item['beneficiaryId'])) ? beneficiaryIdNameMap[parseInt(item['beneficiaryId'])]['gender'] : '-',
                locationId: item['locationId'],
                withAlerts: item['withAlerts'],
                imeiNumber: arrayNotEmptyCheck(item['device']) && notNullCheck(item['device'][0]['imei']) ? item['device'][0]['imei'] : '999999999',
                alertDeviceType: arrayNotEmptyCheck(item['deviceType']) ? item['deviceType'][0]['name'] : '-',
                alertType: notNullCheck(item['alertType']) ? item['alertType'] : 'General alert',
                readStatus: item['readStatus'],
                createdDate: item['createdDate'],
                updatedDate: notNullCheck(item['updatedDate']) ? item['alertType'] : '-'
            };
            modifiedResponse.gridData.push(obj);
        });
        returnObj = fennixResponse(statusCodeConstants.STATUS_OK, 'en', modifiedResponse);
    } else {
        returnObj = fennixResponse(statusCodeConstants.STATUS_NO_TICKETS_FOR_USER_ID, 'en', []);
    }
    return returnObj;
};
const addTicketBusiness = async (req) => {
    let primaryKeyResponse, counter, messages = [];
    primaryKeyResponse = await fetchNextPrimaryKeyAccessor();
    if (arrayNotEmptyCheck(primaryKeyResponse)) {
        counter = parseInt(primaryKeyResponse[0]['counter']);
        req.body.messages.forEach(msg => {
            let msgObj = {
                userId: msg.userId,
                message: msg.message,
                timestamp: new Date()
            };
            messages.push(msgObj);
        });

        let obj = {
            _id: counter,
            userId: req.body.userId,
            centerId: req.body.centerId,
            beneficiaryId: req.body.beneficiaryId,
            locationId: req.body.locationId,
            ticketName: req.body.ticketName,
            ticketDescription: req.body.description,
            ticketGenerationType: req.body.ticketGenerationType,
            withAlerts: req.body.withAlerts,
            ticketStatus: req.body.ticketStatus,
            messages: messages,
            createdDate: new Date()
        };
        addTicketAccessor(obj);
        insertNextPrimaryKeyAccessor(primaryKeyResponse[0]['_doc']['_id']);
    }
};
const ticketDetailsBasedOnTicketIdBusiness = async (req) => {
    let response = {}, ticketResponse;
    ticketResponse = await ticketDetailsBasedOnTicketIdAccessor(req.query.ticketId);
    if (objectHasPropertyCheck(ticketResponse, 'rows') && arrayNotEmptyCheck(ticketResponse.rows)) {
        let ticketDetails = ticketResponse.rows[0];
        let modifiedResponse = {
            ticketId: ticketDetails['_id'],
            ticketName: ticketDetails['ticketName'],
            ticketDescription: ticketDetails['ticketDescription'],
            messages: ticketDetails['messages'],
            createdBy: ticketDetails['createdBy'],
            createdDate: ticketDetails['createdDate']
        };
        response = fennixResponse(statusCodeConstants.STATUS_OK, 'en', modifiedResponse);
    } else {
        response = fennixResponse(statusCodeConstants.STATUS_NO_TICKETS_FOR_USER_ID, 'en', []);
    }
    return response;
};

module.exports = {
    ticketAggregatorBusiness,
    ticketListBasedOnStatusBusiness,
    listTicketsBusiness,
    addTicketBusiness,
    ticketDetailsBasedOnTicketIdBusiness
};
