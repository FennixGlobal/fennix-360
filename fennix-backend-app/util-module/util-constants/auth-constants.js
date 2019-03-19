const JWTSecretPass = 'SOFIA-Fennix Global';
const authAgeTypeMap = {
    cookie: 60, // 60 days
    login: 7, // 1 week
    forget_password: 0.33 // 8/24 hours  --> 8 hours
};
module.exports = {
    JWTSecretPass,
    authAgeTypeMap
};