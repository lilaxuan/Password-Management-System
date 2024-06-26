const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true // add an index so that we can query a User by username 
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        required: false,
        default: 'http://localhost:8000/default-avatar.png'
    },
    receivedPasswords: [{
        sharedReuqestId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'ShareRequest'
        },
        passwordId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Password'
        },
        sharedUserId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        sharedUsername: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'accepted', 'refused']
        }
    }]
});

// Mongoose will create a new model. This model will correspond to a collection named users in the MongoDB database 
// (Mongoose will automatically convert the model name User to lowercase and pluralize it (users) as the collection name). 
// If the collection does not exist, it will be created when you first insert the document.
module.exports = userSchema;