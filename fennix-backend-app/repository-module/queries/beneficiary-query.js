const selectBeneficiaryByUserIdQuery = 'select beneficiaryid from beneficiaries where owner_user_id = $1;\n';
const selectBeneficiaryByOwnerIdQuery = 'select (select role_name from roles where role_id = beneficiary_role) as role_name, count(beneficiary_role) from beneficiaries \n' +
    'where owner_user_id = $1\n' +
    'group by beneficiary_role';

const selectBeneficiaryListByOwnerUserIdQuery = 'select beneficiaryId, firstname, lastname, emailid, crime_id, mobileno, gender\n' +
    'from beneficiaries\n' +
    'where owner_user_id = $1 and center_id = $2\n' +
    'order by $3\n' +
    'offset $4 limit $5';

const checkBeneficiaryEmailIdQuery = 'select beneficiaryid from beneficiaries where emailid = $1';

const authenticateBeneficiaryQuery = 'select r.role_name,b.user_role, first_name, last_name, beneficiaryid, owner_user_id, emailid, isactive,b.center_id from beneficiaries b\\n\' +\n' +
    '    \'join roles r on r.role_id = u.beneficiary_role\\n\' +\n' +
    '    \'where emailid=$1 and password=$2';

const getBenefeciaryIdListForOwnerAndCenterQuery = 'select beneficiaryId,firstname,lastname,gender,emailid,(select role_name from roles where role_id = beneficiary_role) as role, device_updated_date, document_id, mobileno,image from beneficiaries\n' +
    'where owner_user_id = (select user_id from users where user_id = $1) and center_id = $2\n' +
    'order by $3 desc nulls last\n' +
    'offset $4 limit $5';
module.exports = {
    selectBeneficiaryByUserIdQuery,
    selectBeneficiaryByOwnerIdQuery,
    selectBeneficiaryListByOwnerUserIdQuery,
    checkBeneficiaryEmailIdQuery,
    authenticateBeneficiaryQuery,
    getBenefeciaryIdListForOwnerAndCenterQuery
};