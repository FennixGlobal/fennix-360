const TABLE_USERS = 'users';
const TABLE_BENEFICIARIES = 'beneficiaries';
const TABLE_LOCATION = 'location';
const TABLE_ROLES = 'roles';

const dbTableColMap = {
    users: {
        locationId: 'location_id',
        address: 'address1',
        center:'center_id',
        country:'location_id',
        firstName: 'first_name',
        lastName: 'last_name',
        emailId: 'email_id',
        phoneNo: 'mobile_no',
        gender: 'gender',
        image: 'image',
        role: 'user_role'
    },
    filterset: {
        roleCardId: 'role_card_id',
        routeId: 'route_id',
        roleCardWidgetId: 'role_card_widget_id'
    }
};

module.exports = {
    dbTableColMap,
    TABLE_BENEFICIARIES,
    TABLE_LOCATION,
    TABLE_ROLES,
    TABLE_USERS
};
