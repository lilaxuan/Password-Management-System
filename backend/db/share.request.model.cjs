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

// since we need to get the id right after the shareReuqest is created, so that we can define this method here!! 
async function createNewShareRequest(data) {
    try {
        const shareRequest = await ShareRequestModel.create(data);
        return shareRequest;  // This returns the created document with its _id
    } catch (error) {
        console.error("Failed to create share request:", error);
        throw error;  // Re-throw the error to be handled by the caller
    }
}


module.exports = {
    createNewShareReuqest,
    getAllShareRequests,
    getShareReuqestById,
    deleteShareReuqest,
    updateShareRequest,
    createNewShareRequest
}