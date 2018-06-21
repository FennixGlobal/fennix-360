const {cardWidgetMetadataQuery,modalMetadataQuery,headerMetadataQuery,sideNavMetadataQuery,loginMetadataQuery, getRoleQuery} = require('../queries/metadata-query');
const {selectCenterIdsForGivenUserIdQuery} = require('../queries/location-query');
const {selectLanguagesQuery} = require('../queries/language-query');
const {insertSimcardQuery, deleteSimcardQuery, getSimcardDetailsQuery, updateSimcardQuery} = require('../queries/simcard-query');
const {connectionCheckAndQueryExec} = require('../../util-module/custom-request-reponse-modifiers/response-creator');

const getCardMetadataAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec( req, cardWidgetMetadataQuery);
    return returnObj;
};
const getSideNavMetadataAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec( req, sideNavMetadataQuery);
    return returnObj;
};
const getHeaderMetadataAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec( req, headerMetadataQuery);
    return returnObj;
};

const getCenterIdsBasedOnUserIdAccessor = async (req) => {
    let centerIdResponse;
    centerIdResponse = await connectionCheckAndQueryExec(req, selectCenterIdsForGivenUserIdQuery);
    return centerIdResponse;
};

const getSimcardDetailsAccessor = async (req) => {
    let responseObj;
    responseObj = await getSimcardDetailsQuery(req);
    return responseObj;
};

const getLanguagesAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, selectLanguagesQuery);
    return returnObj;
};

const getLoginMetadataAccessor = async(req)=>{
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, loginMetadataQuery);
    return returnObj;
};
const getModalMetadataAccessor = async (req) => {
    let returnObj;
    returnObj = await connectionCheckAndQueryExec(req, modalMetadataQuery);
    return returnObj;
};


const getRolesAccessor = async (req) => {
  let returnObj;
  returnObj = await connectionCheckAndQueryExec(req, getRoleQuery);
  return returnObj;
};

module.exports = {
    getCardMetadataAccessor,
    getSideNavMetadataAccessor,
    getHeaderMetadataAccessor,
    getLoginMetadataAccessor,
    getCenterIdsBasedOnUserIdAccessor,
    getSimcardDetailsAccessor,
    getLanguagesAccessor,
    getRolesAccessor,
    getModalMetadataAccessor
};

