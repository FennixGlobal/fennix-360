const dbTableColMap = {
    users: {
        locationId: 'location_id',
        firstName: 'first_name',
        lastName: 'last_name',
        emailId: 'email_id',
        mobileNo: 'mobile_no',
        gender: 'gender',
        image: 'image',
        role: 'user_role'
    }
};

const TABLE_USERS = 'users';
const TABLE_BENEFICIARIES = 'beneficiaries';
const TABLE_LOCATION = 'location';
const TABLE_ROLES = 'roles';

module.exports = {
    dbTableColMap,
    TABLE_BENEFICIARIES,
    TABLE_LOCATION,
    TABLE_ROLES,
    TABLE_USERS
};
