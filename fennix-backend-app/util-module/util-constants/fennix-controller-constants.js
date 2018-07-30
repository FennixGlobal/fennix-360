const USER_CONTROLLER = {
    USER_UPDATE_USER_PROFILE:'/updateProfile',
    USER_LIST_OPERATORS: '/listOperators',
    USER_GET_USER_LIST:'/listUsers',
    USER_DELETE_USER:'/deleteUser',
    USER_UPDATE_USER:'/updateUser',
    USER_GET_USER_DETAILS:'/getUserDetails',
    USER_ADD_USER:'/addUser',
    USER_DOWNLOAD_USER:'/downloadUsers',
    USER_FETCH_USER_PROFILE:'/fetchProfile'
};

const SIMCARD_CONTROLLER = {
    SIMCARD_LIST_UNASSIGNED_SIMCARDS:'/listUnAssignedSimcards',
    SIMCARD_LIST_SIMCARDS_FOR_USER:'/listSimCards',
    SIMCARD_ADD_SIMCARD:'/addSimcard',
    SIMCARD_GET_SIMCARD_DETAILS:'/simCardDetails',
    // SIMCARD_UPDATE_SIMCARD:,
    // SIMCARD_DELETE_SIMCARD:,
    SIMCARD_LIST_SIMCARD_TYPES:'/listSimcardTypes'
};

module.exports = {
    USER_CONTROLLER,
    SIMCARD_CONTROLLER
};