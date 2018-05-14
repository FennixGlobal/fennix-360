const selectBeneficiaryByUserIdQuery = 'select beneficiaryid from beneficiaries where owner_user_id = $1;\n';
const selectBeneficiaryByOwnerIdQuery = 'select (select role_name from roles where role_id = beneficiary_role) as role_name, count(beneficiary_role) from beneficiaries \n' +
    'where owner_user_id = $1\n' +
    'group by beneficiary_role';
const selectBeneficiaryListByOwnerUserIdQuery = 'select firstname, lastname, emailid, crime_id, mobileno, gender from beneficiaries where owner_user_id = $1 and center_id = $2';
module.exports = {
    selectBeneficiaryByUserIdQuery,
    selectBeneficiaryByOwnerIdQuery,
    selectBeneficiaryListByOwnerUserIdQuery
};