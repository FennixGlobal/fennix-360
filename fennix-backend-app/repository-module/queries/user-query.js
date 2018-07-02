const checkUserEmailQuery = 'select  user_id FROM users where email_id=$1';
const userProfileQuery = 'select u.first_name, u.last_name, u.mobile_no\n' +
    '    , concat(u.address1, \', \', u.address2) as address\n' +
    '    , (select localized_text from localization where locale_key = (select role_name from roles where role_id = u.user_role) and language = $2) as role_name\n' +
    '    , u.email_id as emailid\n' +
    '    , u.image, u.gender\n' +
    '    , (select localized_text from localization\n' +
    'where locale_key = (select locale_key from location where location_id = u.location_id) and language = $2) as location_name\n' +
    'from users u where u.user_id = $1;\n';

const authenticateUser = 'select (select localized_text from localization where locale_key = (select role_name from roles where role_id = u.user_role) and language = $2) as role_name,u.user_role,password, first_name, last_name, user_id, owner_user_id, email_id, isactive,u.center_id from users u\n' +
    'join roles r on r.role_id = u.user_role\n' +
    'where email_id=$1';

const updateUserProfileQuery = 'update users set first_name=$2,last_name=$3,address1=$4,mobile_no=$5,image=$6) where user_id=$1';

const getUserListQuery = 'select user_id, concat(first_name, \' \', last_name) as full_name, email_id, mobile_no, isactive, (select localized_text from localization where locale_key IN (select role_name from roles where role_id = user_role) and language = $2) as role, (select localized_text from localization where locale_key IN (select location_name from location where location_id = u.center_id) and language = $2) as center, image from users u where owner_user_id = $1;';

const getUserNameFromUserIdQuery = 'select concat(first_name, \' \', last_name) as full_name, (select localized_text from localization where locale_key = (select role_name from roles where role_id = u.user_role) and language = $1) as role_name, user_id, gender, user_role, (select role_name from roles where role_id = u.user_role) as native_user_role from users u where user_id = $2';
const insertUserQuery = 'insert into ';

const getUserIdsForSupervisorQuery = 'select concat(first_name, \' \', last_name) as full_name, (select localized_text from localization where locale_key = (select role_name from roles where role_id = u.user_role) and language = $2) as role_name, user_id, gender, user_role from users u where owner_user_id = $1  or user_id = $1';
const getUserIdsForAdminQuery = 'select concat(first_name, \' \', last_name) as full_name, (select localized_text from localization where locale_key = (select role_name from roles where role_id = u.user_role) and language = $2) as role_name, user_id, gender, user_role from users u where owner_user_id = (select user_id from users where owner_user_id = $1) or user_id = $1';
const getUserIdsForSuperAdminQuery = 'select concat(first_name, \' \', last_name) as full_name, (select localized_text from localization where locale_key = (select role_name from roles where role_id = u.user_role) and language = $2) as role_name, user_id, gender, user_role from users u where owner_user_id = (select user_id from users where owner_user_id = (select user_id from users where owner_user_id = $1)) or user_id = $1';
const getUserIdsForMasterAdminQuery = 'select concat(first_name, \' \', last_name) as full_name, (select localized_text from localization where locale_key = (select role_name from roles where role_id = u.user_role) and language = $2) as role_name, user_id, gender, user_role from users u where owner_user_id = (select user_id from users where owner_user_id = (select user_id from users where owner_user_id = (select user_id from users where owner_user_id = $1))) or user_id = $1';


module.exports = {
    insertUserQuery,
    getUserListQuery,
    checkUserEmailQuery,
    userProfileQuery,
    authenticateUser,
    updateUserProfileQuery,
    getUserNameFromUserIdQuery,
    getUserIdsForAdminQuery,
    getUserIdsForMasterAdminQuery,
    getUserIdsForSuperAdminQuery,
    getUserIdsForSupervisorQuery
};