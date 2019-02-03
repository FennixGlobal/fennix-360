const {SearchModel} = require('../models/search-model');

const searchQuery = (req) => {
    return SearchModel.find({
        value: {$regex: `.*${req}.*`}
    });
};

const insertSearchQuery = (req) => {
    return SearchModel.collection.insert(req, function (err, doc) {
        if (err) {
            console.log('error while saving search request');
        } else {
            console.log('Saved search request successfully');
        }
    });
};

module.exports = {
    searchQuery,
    insertSearchQuery
};
