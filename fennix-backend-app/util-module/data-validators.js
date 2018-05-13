var notNullCheck = (data)=> data !== null && data !== undefined && data !== '';
var arrayNotEmptyCheck = (arrayData)=> notNullCheck(arrayData) && Object.prototype.toString.call(arrayData) === '[object Array]' && arrayData.length > 0;
var objectHasPropertyCheck = (objectData,propertyName)=> notNullCheck(objectData) && objectData.hasOwnProperty(propertyName) && notNullCheck(objectData[propertyName]);

module.exports = {
    notNullCheck,
    arrayNotEmptyCheck,
    objectHasPropertyCheck
}