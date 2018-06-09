const checkUserEmailQuery = 'select  user_id FROM users where email_id=$1';
const userProfileQuery = 'select * FROM users where user_id=$1';
const authenticateUser = 'select r.role_name,u.user_role,password, first_name, last_name, user_id, owner_user_id, email_id, isactive,u.center_id from users u\n' +
    'join roles r on r.role_id = u.user_role\n' +
    'where email_id=$1';
const updateUserProfileQuery = 'update users set first_name=$2,last_name=$3,address1=$4,mobile_no=$5,image=$6) where user_id=$1';
const getUserListQuery = 'select * from users where owner_user_id=$1';

module.exports = {
    getUserListQuery,
    checkUserEmailQuery,
    userProfileQuery,
    authenticateUser,
    updateUserProfileQuery
};