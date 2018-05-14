var postgresDBDev = {
    user: 'postgres',
    host: 'localhost',
    database: 'fennix_dev_db',
    password: 'postgres',
    port: 5432,
};

var postgresDBProd = {
    user: 'postgres',
    host: 'localhost',
    database: 'fennix_dev',
    password: 'postgres',
    port: 5432,
};

module.exports = {
    postgresDBDev,
    postgresDBProd
};