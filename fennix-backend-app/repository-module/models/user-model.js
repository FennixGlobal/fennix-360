var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    _id: {Type: String},
    userType: {Type: String},
    userDetails: {
        firstName: {Type: String},
        lastName: {Type: String},
        dob: {Type: String},
        emailId: {Type: String},
        mblNo: {Type: String},
        address: {
            address1: {Type: String},
            address2: {Type: String},
            city: {Type: String},
            cityCode: {Type: String},
            state: {Type: String},
            stateCode: {Type: String},
            country: {Type: String},
            countryCode: {Type: String},
            postalCode: {Type: String}
        },
        salt: {Type: String},
        password: {Type: String},
        crimeDetails: {
            crimeId: {type: String},
            hasHouseArrest: {type: Boolean}
        },
        features: {
            eyeColor: {Type: String},
            height: {Type: String},
            weight: {Type: String},
            hairColor: {Type: String},
            scarsMarksOrTatoos: {Type: String}
        },
        isActive: {Type: Boolean},
        ownerUserId: {Type: String}
    }
});
module.exports = mongoose.model('User', userSchema, 'userDetails');

