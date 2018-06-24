const {dbTableColMap} = require("../util-module/db-constants");

const mongoWhereInCreator = (data) => {
    return {'$in': data}
};

const postgresUpdateCreator = (array) => {

};
const filterQueryCreator = (filterQuery, colName) => {
    filterQuery = filterQuery.replace('{0}', `fs.${dbTableColMap['filterset'][colName]}`);
    return filterQuery;
};

const insertQueryCreator = (req, tableName, insertQuery) => {
    let columns = '', values = 'values', modifiedInsertQuery, valuesArray = [], finalResponse = {};
    Object.keys(req).forEach((key, index) => {
        if (index === 0) {
            columns = `(${dbTableColMap[tableName][key]}`;
            values = `${values} ($${index + 1}`;
        } else if (index === Object.keys(req).length - 1) {
            columns = `${columns},${dbTableColMap[tableName][key]})`;
            values = `${values}, $${index + 1})`;
        } else {
            columns = `${columns},${dbTableColMap[tableName][key]}`;
            values = `${values}, $${index + 1}`;
        }
        valuesArray.push(req[key]);
    });
    modifiedInsertQuery = `${insertQuery} ${tableName} ${columns} ${values}`;
    finalResponse['valuesArray'] = valuesArray;
    finalResponse['modifiedInsertQuery'] = modifiedInsertQuery;
    return finalResponse;
};


const requestInModifier = (itemArray, query) => {
    let modifiedQuery = query;
    itemArray.forEach((item, index) => {
        const paramNumber = index + 2;
        if (index === 0 && itemArray.length === 1) {
            modifiedQuery = `${modifiedQuery} ($${paramNumber})`;
        } else if (index  === 0) {
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
    filterQueryCreator,
    mongoWhereInCreator,
    requestInModifier,
    insertQueryCreator
};