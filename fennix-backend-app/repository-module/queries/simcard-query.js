const {simcardDetails} = require('../models/simcard-model');

const getSimcardDetailsQuery = (query) => {
    return simcardDetails.find(query);
};

const insertSimcardQuery = (query) => {
    return simcardDetails.insert(query);
};

const updateSimcardQuery = (query) => {
    return simcardDetails.update(query.where, query.update, query.upsert, query.multi);
};

const deleteSimcardQuery = (query) => {
    return simcardDetails.find(query.where).remove().exec();
};

module.exports = {
    getSimcardDetailsQuery,
    insertSimcardQuery,
    updateSimcardQuery,
    deleteSimcardQuery
};