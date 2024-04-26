const model = require('mongoose').model;

const UserSchema = require('./share.request.schema.cjs');

const ShareRequestModel = model('ShareRequest', UserSchema); // The model `ShareRequest` corresponds to the collection of 'sharerequests' in the database defined in the schema

function createNewShareReuqest(shareRequest) {
    return ShareRequestModel.create(shareRequest);
}

function getAllShareRequests() {
    return ShareRequestModel.find().exec();
}

function getShareReuqestById(id) {
    return ShareRequestModel.findById(id).exec();
}

function deleteShareReuqest(id) {
    return ShareRequestModel.deleteOne({ _id: id })
}

function updateShareRequest(id, shareRequest) {
    return ShareRequestModel.findOneAndUpdate({ _id: id }, shareRequest)
}


module.exports = {
    createNewShareReuqest,
    getAllShareRequests,
    getShareReuqestById,
    deleteShareReuqest,
    updateShareRequest
}