const eLockSessionAccessors = require('../../repository-module/data-accesors/e-lock-session-accessor');

const insertELockSessionBusiness = async (req) => {
    await eLockSessionAccessors.insertELockSessionAccessor(req);
};

const getELockSessionBusiness = async (req) => {
    await eLockSessionAccessors.getELockSessionAccessor(req);
};
module.exports = {
    insertELockSessionBusiness,
    getELockSessionBusiness
};