const postgresDBLocal = {
    user: 'postgres',
    host: 'localhost',
    database: 'fennix_dev',
    password: 'postgres',
    port: 5432
};

const postgresDBDev = {
    user: 'postgres',
    host: '172.31.32.106',
    database: 'postgres_dev',
    password: 'zVCf58zMDNfF',
    port: 5432
};

const mongoLocal = 'mongodb://localhost:27017/fennixDevDb';

const mongoDev = 'mongodb://fenDevUser:fenDevUser@172.31.32.79:27017/fennix_dev';

module.exports = {
    postgresDBLocal,
    postgresDBDev,
    mongoDev,
    mongoLocal
};