const {SearchModel} = require('../models/search-model');

const searchQuery = (req) => {
    return SearchModel.find({
        value: {$regex: `.*${req['value']}.*`},
        tag: req['tag']
    });
};

const insertSearchQuery = (req) => {
    return SearchModel.collection.insertMany(req, function (err, doc) {
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
