const postgresDBLocal = {
    user: 'postgres',
    host: 'localhost',
    database: 'sofia_new_fennix_dev',
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
const postgresSofiaDev = {
    user: 'postgres',
    host: '172.31.23.177',
    database: 'sofia_prod_aug16',
    password: 'zVCf58zMDNfF',
    port: 5432
};
const imageLocalLocation = 'E:/DB/';

const imageDBLocation = '../fennix-images/';

const mongoLocal = 'mongodb://localhost:27017/sofia_fennix_dev';

const mongoDev = 'mongodb://fenDevUser:fenDevUser@172.31.32.79:27017/fennix_dev';
const mongoSofiaDev = 'mongodb://fenDevUser:fenDevUser@172.31.22.124:27017/fennix_dev';
const mongoLab = 'mongodb://arup:hello123@ds131743.mlab.com:31743/fennix-360';

const TCPBeneficiaryPORT = '3100';
const TCPELockPORT = '3150';
const SocketLocPORT = '3180';

module.exports = {
    postgresDBLocal,
    postgresDBDev,
    mongoDev,
    mongoLocal,
    mongoSofiaDev,
    mongoLab,
    postgresSofiaDev,
    imageLocalLocation,
    imageDBLocation,
    SocketLocPORT,
    TCPBeneficiaryPORT,
    TCPELockPORT
};