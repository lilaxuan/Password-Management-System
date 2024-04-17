const model = require('mongoose').model;

const UserSchema = require('./user.schema.cjs');

const UserModel = model('User', UserSchema); // The model `User` corresponds to the collection of users in the database defined in the schema

function insertUser(user) {
    return UserModel.create(user);
}

function getAllUsers() {
    return UserModel.find().exec();
}

function getUserById(id) {
    return UserModel.findById(id).exec();
}

function deleteUser(id) {
    return UserModel.deleteOne({ _id: id })
}

function updateUser(id, user) {
    return UserModel.findOneAndUpdate({ _id: id }, user)
}

// function getUserByOwner(owner) {
//     return UserModel.find({
//         owner: owner,
//     }).exec();
// }

module.exports = {
    getAllUsers,
    insertUser,
    getUserById,
    updateUser,
    deleteUser
}