const mongoWhereInCreator = (data) => {
    return {'$in':data}
};

const postgresUpdateCreator = (array) => {

};

module.exports = {
    mongoWhereInCreator
};