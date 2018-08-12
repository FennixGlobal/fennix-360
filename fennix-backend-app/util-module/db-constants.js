const TABLE_USERS = 'users';
const TABLE_BENEFICIARIES = 'beneficiaries';
const TABLE_LOCATION = 'location';
const TABLE_ROLES = 'roles';

const dbTableColMap = {
    users: {
        locationId: 'location_id',
        address: 'address1',
        center: 'center_id',
        country: 'location_id',
        firstName: 'first_name',
        lastName: 'last_name',
        emailId: 'email_id',
        phoneNo: 'mobile_no',
        gender: 'gender',
        image: 'image',
        role: 'user_role',
        userId: 'owner_user_id'
    },

    beneficiaries: {
        firstName: 'firstname',
        middleName: 'middle_name',
        lastName2: 'second_last_name',
        lastName: 'first_last_name',
        emailId: 'emailid',
        mobileNo: 'mobileno',
        gender: 'gender',
        image: 'image',
        locationId: 'location_id',
        height: 'height',
        weight: 'weight',
        role: 'beneficiary_role',
        hairColor: 'hair_color',
        eyeColor: 'eye_color',
        crimeId: 'crime_id',
        documentId: 'document_id',
        ethnicityId: 'ethnicity_id',
        familyPhone: 'family_phone',
        centerId: 'center_id',
        languageId: 'language_id',
        riskId: 'risk_id',
        scar: 'scars_marks_tatoos',
        dob: 'dob',
        hasHouseArrest: 'hashousearrest',
        address: 'address1',
        timeZone: 'time_zone',
        zipCode: 'postal_code',
        operatorId: 'owner_user_id',
        center: 'center_id',
        accountingId: 'accounting_id',
        lawyerId: 'lawyer_id',
        tutorId: 'tutor_id',
        whatsAppNumber: 'whatsapp_number',
        districtAttorney: 'district_attorney',
        judge: 'judge',
        courtHouse: 'court_house',
        sentenceCountry: 'sentence_country',
        sentenceCity: 'sentence_city',
        sentenceHouseArrest: 'sentence_house_arrest',
        sentenceRestrainingOrder: 'sentence_restraining_order',
        location0: 'location_0',
        location1: 'location_1',
        location2: 'location_2',
        location3: 'location_3',
        location4: 'location_4'
    },
    filterset: {
        roleCardId: 'role_card_id',
        routeId: 'route_id',
        roleCardWidgetId: 'role_card_widget_id'
    }
};
const dbDownloadTableMapper = {
    beneficiaries: {
        beneficiaryId: 'beneficiaryid',
        beneficiaryName: 'full_name',
        emailId: 'emailid',
        mobileNo: 'mobileno',
        role: 'role_name',
        gender: 'gender',
        crimeId: 'crime_id',
        documentId: 'document_id',
        center: 'center_name'
    },
    devices: {
        deviceId: '_id',
        deviceType: 'deviceType',
        deviceName: 'name',
        imei: 'imei'
    },
    users: {
        userId: 'user_id',
        userName: 'full_name',
        emailId: 'email_id',
        mobileNo: 'mobile_no',
        role: 'role',
        center: 'center'
    },
    tickets: {
        ticketId: 'ticketId',
        ticketName: 'ticketName',
        userName: 'userName',
        userRole: 'userRole',
        beneficiaryName: 'beneficiaryName',
        beneficiaryRole: 'beneficiaryRole',
        imei: 'imeiNumber'
    }
};

const tableKeyMap = {
    beneficiaries: {key: 'beneficiaryid'},
    users: {key: 'user_id'},
    tickets: {key: 'ticketId'}
};

module.exports = {
    dbTableColMap,
    TABLE_BENEFICIARIES,
    TABLE_LOCATION,
    TABLE_ROLES,
    TABLE_USERS,
    tableKeyMap,
    dbDownloadTableMapper
};
