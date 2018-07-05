const postgresDBDev = {
    user: 'postgres',
    host: 'localhost',
    database: 'fennix_dev',
    password: 'postgres',
    port: 5432
};

const postgresDBProd = {
    user: 'postgres',
    host: '172.31.32.106',
    database: 'fennix_dev',
    password: 'postgres',
    port: 5432
};

const mongoLocal = 'mongodb://localhost:27017/fennixDevDb';
const mongoDev = 'mongodb://172.31.32.79:27017/fennixDevDb';

module.exports = {
    postgresDBDev,
    postgresDBProd,
    mongoDev,
    mongoLocal
};