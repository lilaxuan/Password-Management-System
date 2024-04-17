const mongoose = require('mongoose');
const schema = mongoose.Schema;

const passwordSchema = new schema({
    // link each password records to a User object
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // links to 'users' table in the db
        required: true
    },
    url: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Mongoose will create a new model. This model will correspond to a collection named users in the MongoDB database 
// (Mongoose will automatically convert the model name User to lowercase and pluralize it (passwords) as the collection name). 
// If the collection does not exist, it will be created when you first insert the document.
module.exports = mongoose.model('Password', passwordSchema);