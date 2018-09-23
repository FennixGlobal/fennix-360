const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    documentType: String,
    documentSize: String,
    documentLink: String,
    documentName: String,
    createdDate: Date,
    createdByUser: String,
    updatedDate: Date,
    updatedByUser: String
});
const beneficiaryDocumentSchema = new Schema({
    _id: Number,
    beneficiaryId: Number,
    profile: [documentSchema],
    contract: [documentSchema],
    agreement: [documentSchema],
    invoice: [documentSchema],
});

const beneficiaryDocumentModel = mongoose.model('beneficiaryDocument', beneficiaryDocumentSchema, 'beneficiaryDocuments');

module.exports = {
    beneficiaryDocumentModel
};