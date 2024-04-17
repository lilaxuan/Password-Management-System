const model = require('mongoose').model;

const PasswordSchema = require('./password-schema.cjs');

const PasswordModel = model('Password', PasswordSchema); // The model `Password` corresponds to the collection of users in the database defined in the schema

function addNewPassword(password) {
    return PasswordModel.create(password);
}

// function getAllPasswords() {
//     return PasswordModel.find().exec();
// }

function getPasswordByUsername(id) {
    return PasswordModel.findById(id).exec();
}

function deletePassword(id) {
    return PasswordModel.deleteOne({ _id: id })
}

function updatePassword(id, password) {
    return PasswordModel.findOneAndUpdate({ _id: id }, password)
}

// function getPasswordByOwner(owner) {
//     return PasswordModel.find({
//         owner: owner,
//     }).exec();
// }

module.exports = {
    addNewPassword,
    getPasswordByUsername,
    updatePassword,
    deletePassword
}