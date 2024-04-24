const model = require('mongoose').model;
const mongoose = require('mongoose');
const PasswordSchema = require('./password.schema.cjs');
const PasswordModel = model('Password', PasswordSchema); // The model `Password` corresponds to the collection of users in the database defined in the schema

function addNewPassword(password) {
    return PasswordModel.create(password);
}

function getAllPasswords() {
    return PasswordModel.find().exec();
}

// id is auto-generated in mongodb
function getPasswordById(id) {
    return PasswordModel.findById(id).exec();
}

// Find all passwords assicoated with the user; 
function getPasswordByUserId(userId) {
    return PasswordModel.find({ userId: userId }); // has to import body parser in server.js and this method has to be defined here to be used. 
}

function checkUniqueUrlUser(userId, url) {
    return PasswordModel.findOne({ userId, url });
}

function getPasswordByUrl(url, userId) {
    return PasswordModel.findOne({ url, userId }).exec();
}

// function getPasswordByUrl(url) {
//     return PasswordModel.findOne({ url }).exec();
// }

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
    getAllPasswords,
    addNewPassword,
    getPasswordById,
    getPasswordByUrl,
    updatePassword,
    deletePassword,
    getPasswordByUserId,
    checkUniqueUrlUser
}