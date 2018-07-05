const {CarrierModel} = require('../models/carrier-model');

const listCarriersQuery = () => {
    return CarrierModel.find(
        {
            isActive: true
        },
        {
            name: 1
        }
    );
};

module.exports = {
    listCarriersQuery
};