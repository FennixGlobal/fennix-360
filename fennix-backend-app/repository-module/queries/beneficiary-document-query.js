const {beneficiaryDocumentModel} = require('../models/beneficiay-document-model');

const updateBeneficiaryDocumentQuery = (beneficiaryId, categoryName, documentObj) => {
    return beneficiaryDocumentModel.update({beneficiaryId: beneficiaryId},
        {
            $push : {
                [categoryName]: documentObj
            }
        },{upsert: true}).then(doc => {
        if (!doc) {
            console.log('error');
        }
    });
};

const getBeneficiaryDocumentsQuery = (beneficiaryId) => {
    return beneficiaryDocumentModel.find({beneficiaryId: beneficiaryId});
};

module.exports = {
    updateBeneficiaryDocumentQuery,
    getBeneficiaryDocumentsQuery
};