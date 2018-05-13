const {userProfileQuery} = require('../queries/user-query');
const {postgresClient} = require('../repository-index');
const {postgresRequestMapper} = require('../../util-module/custom-request-reponse-modifiers/response-creator');

//This method is used to get user details for the given userId
var getUserDetails = (req) => postgresRequestMapper(userProfileQuery, req, postgresClient);
var addUser = (req) => postgresRequestMapper(userProfileQuery, req, postgresClient);
var deleteUser = (req) => postgresRequestMapper(userProfileQuery, req, postgresClient);
var updateUserDetails = (req) => postgresRequestMapper(userProfileQuery, req, postgresClient);
var retireUser = (req) => postgresRequestMapper(userProfileQuery, req, postgresClient);

module.exports = {
    getUserDetails
};