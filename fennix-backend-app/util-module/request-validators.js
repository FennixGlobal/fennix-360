const {dbTableColMap, dbDownloadTableMapper, tableKeyMap} = require("../util-module/db-constants");
const {objectHasPropertyCheck} = require('../util-module/data-validators');
const {getDownloadMapperAccessor} = require('../repository-module/data-accesors/common-accessor');
const mongoWhereInCreator = (data) => {
    return {'$in': data}
};

const postgresUpdateCreator = (array) => {

};
const filterQueryCreator = (filterQuery, colName) => {
    filterQuery = filterQuery.replace('{0}', `fs.${dbTableColMap['filterset'][colName]}`);
    return filterQuery;
};

const excelColCreator = async () => {
    let downloadMapperResponse, finalResponse = {}, keysArray = [];
    downloadMapperResponse = await getDownloadMapperAccessor([]);
    if (objectHasPropertyCheck(downloadMapperResponse, 'rows') && arrayNotEmptyCheck(downloadMapperResponse.rows)) {
        const cols = [];
        downloadMapperResponse.rows.forEach(item => {
            cols.push({
                header: item['localized_key'],
                key: item['mapping_key']
            });
            keysArray.push(item['mapping_key']);
        });
        finalResponse['cols'] = cols;
        finalResponse['keysArray'] = keysArray;
    }
    return finalResponse;
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


const requestInModifier = (itemArray, query, isLanguage) => {
    let modifiedQuery = query;
    itemArray.forEach((item, index) => {
        const paramNumber = isLanguage ? index + 2 : index + 1;
        if (index === 0 && itemArray.length === 1) {
            modifiedQuery = `${modifiedQuery} ($${paramNumber})`;
        } else if (index === 0) {
            modifiedQuery = `${modifiedQuery} ($${paramNumber},`;
        } else if (index === (itemArray.length - 1)) {
            modifiedQuery = `${modifiedQuery} $${paramNumber})`;
        } else {
            modifiedQuery = `${modifiedQuery} $${paramNumber},`;
        }
    });
    return modifiedQuery;
};
const excelRowsCreator = (list, table, keysArray) => {
    let returnObj = {}, ids = [], finalResponse = {};
    if (objectHasPropertyCheck(list, 'rows') && arrayNotEmptyCheck(list.rows)) {
        list.rows.forEach(item => {
            returnObj[item[tableKeyMap[table]['key']]] = {};
            keysArray.forEach((key) => {
                returnObj[item[tableKeyMap[table]['key']]][key] = item[dbDownloadTableMapper[table][key]];
            });
            ids.push(`${item[tableKeyMap[table]['key']]}`);
        });
    }
    finalResponse['rows'] = returnObj;
    finalResponse['ids'] = ids;
    return finalResponse;
};


module.exports = {
    filterQueryCreator,
    mongoWhereInCreator,
    requestInModifier,
    insertQueryCreator,
    excelColCreator,
    excelRowsCreator
};