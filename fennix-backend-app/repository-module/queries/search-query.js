const {SearchModel} = require('../models/search-model');

const searchQuery = (req) => {
    return SearchModel.find({
        value: {$regex: `.*${req}.*`}
    });
};

module.exports = {
    searchQuery
};
