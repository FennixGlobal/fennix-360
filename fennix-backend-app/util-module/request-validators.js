const mongoWhereInCreator = (data) => {
    return {'$in': data}
};

const postgresUpdateCreator = (array) => {

};

const requestInModifier = (itemArray, query) => {
    let modifiedQuery = query;
    itemArray.forEach((item, index) => {
        const paramNumber = index + 2;
        if (index === 0) {
            modifiedQuery = `${modifiedQuery} ($${paramNumber},`;
        } else if (index === (itemArray.length - 1)) {
            modifiedQuery = `${modifiedQuery} $${paramNumber})`;
        } else {
            modifiedQuery = `${modifiedQuery} $${paramNumber},`;
        }
    });
    return modifiedQuery;
};


module.exports = {
    mongoWhereInCreator,
    requestInModifier
};