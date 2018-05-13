const selectBeneficiaryByUserIdQuery = 'select beneficiaryid from beneficiaries where owner_user_id = $1;\n';

module.exports = {
    selectBeneficiaryByUserIdQuery
};