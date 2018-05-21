var checkUserEmailQuery = 'select  user_id FROM users where email_id=$1';
var userProfileQuery = 'select * FROM users where user_id=$1';
var authenticateUser = 'select r.role_name,u.user_role, first_name, last_name, user_id, owner_user_id, email_id, isactive,u.center_id from users u\n' +
    'join roles r on r.role_id = u.user_role\n' +
    'where email_id=$1 and password=$2';
var updateUserProfileQuery = '';
module.exports = {
    checkUserEmailQuery,
    userProfileQuery,
    authenticateUser,
    updateUserProfileQuery
};